var crypto = require('crypto');

//Convert a 32bit value to little endian
function littleEndian(val) {
    //Convert to a hex string
    var asString = val.toString(16);

    //Pad string with leading zeroes to ensure 32bit length
    var fullStr = "";
    for (var i = asString.length; i < 8; ++i)
        fullStr = fullStr + "0";
    fullStr = fullStr + asString;

    //Make the conversion
    return swapOrder(fullStr);
}

//Utility for neater code
function toHex(val) {
    return val.toString(16);
}

function swapOrder(str) {
    //Break up the string into an array of characters
    var split = str.split("");
    //Reverse the character array
    split.reverse();

    //Build up a new string by swapping the order of every 2 characters
    var x = "";
    for (var i = 0; i < split.length; i += 2) {
        x = x + split[i + 1] + split[i];
    }

    return x;
}

//Accept a JSON object representation of a genesis block in string format and calculate the hash
function generateGenesisHash(rawJsonStr) {
    var jsonObj = JSON.parse(rawJsonStr);
    //var jsonObj = rawJsonStr;

    //Extract the fields from the json object
    var version = jsonObj.ver;
    var time = jsonObj.time;
    var bits = jsonObj.bits;
    var nonce = jsonObj.nonce;
    var prevBlock = jsonObj.prev_block;
    var mrkl_root = calcRootHash(jsonObj);

    //Convert these integer fields to little endian
    version = littleEndian(version);
    time = littleEndian(time);
    bits = littleEndian(bits);
    nonce = littleEndian(nonce);

    //Swap the hex orders for this string
    prevBlock = swapOrder(prevBlock);
    mrkl_root = swapOrder(mrkl_root);

    //Concatenate to one long hex string
    var headerHex = toHex(version) + prevBlock + mrkl_root + toHex(time) + toHex(bits) + toHex(nonce);

    //Create a buffer form the long hex string
    var buffer = new Buffer(headerHex, 'hex');
    //Run pass one of the hashing
    var passOne = crypto.createHash('sha256').update(buffer).digest('hex');

    //Run pass two of the hashing
    buffer = new Buffer(passOne, 'hex');
    var passTwo = crypto.createHash('sha256').update(buffer).digest('hex');

    return swapOrder(passTwo);
}

//concatenate 2 hashes as hex
function mergeHashes(hash1, hash2) {
    var combinedBinary = new Buffer(swapOrder(hash1) + swapOrder(hash2), 'hex');

    //Hash it, keep result as binary for pass 2
    var pass1 = crypto.createHash('sha256').update(combinedBinary, 'binary').digest('binary');
    //Hash again, return as hex this time
    return swapOrder(crypto.createHash('sha256').update(pass1, 'binary').digest('hex'));
}

function calcRootHash(jsonObj) {
    //Build up an array of all the transaction hashes
    //the json object has an array 'tx' each element has a hash field, that is what we are gathering
    var allTransactionHashes = jsonObj.tx.map(function (current) {
        return current.hash;
    });

    //Recursive tree function
    var calculateMerkleRoot = function (merkleTree) {
        //When the array contains one entry, return it as the hash
        if (merkleTree.length == 1) {
            //This is our result
            return merkleTree[0];
        }

        if (merkleTree.length % 2 != 0) {
            //An odd number so add the hash twice
            merkleTree.push(merkleTree[merkleTree.length - 1]);
        }

        var newLeaves = [];
        for (var i = 0; i < merkleTree.length; i += 2) {
            //Merge the next 2 hashes in the list and add to the end of the new leaves array
            var mergedHashes = mergeHashes(merkleTree[i], merkleTree[i + 1]);
            newLeaves.push(mergedHashes);
        }

        return calculateMerkleRoot(newLeaves);
    };

    return calculateMerkleRoot(allTransactionHashes);
}

module.exports = {
    calcHash: function(obj) {
        return generateGenesisHash(obj);
    }
};