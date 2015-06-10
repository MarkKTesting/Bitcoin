(function() {
    var crypto = require('crypto');

    //Raw JSON from the page linked to in the HTML5 training exercise
    var raw_exercise = '{"hash":"000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f","ver":1,"prev_block":"0000000000000000000000000000000000000000000000000000000000000000","mrkl_root":"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b","time":1231006505,"bits":486604799,"nonce":2083236893,"n_tx":1,"size":285,"tx":[{"hash":"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b","ver":1,"vin_sz":1,"vout_sz":1,"lock_time":0,"size":204,"in":[{"prev_out":{"hash":"0000000000000000000000000000000000000000000000000000000000000000","n":4294967295},"coinbase":"04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73"}],"out":[{"value":"50.00000000","scriptPubKey":"04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG"}]}],"mrkl_tree":["4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"]}';

    var raw_mrkl_source = '{"hash":"00000000000000001e8d6829a8a21adc5d38d0a473b144b6765798e61f98bd1d","ver":1,"prev_block":"00000000000008a3a41b85b8b29ad444def299fee21793cd8b9e567eab02cd81","mrkl_root":"2b12fcf1b09288fcaff797d71e950e71ae42b91e8bdb2304758dfcffc2b620e3","time":1305998791,"bits":440711666,"nonce":2504433986,"n_tx":4,"size":1496,"tx":[{"hash":"51d37bdd871c9e1f4d5541be67a6ab625e32028744d7d4609d0c37747b40cd2d","ver":1,"vin_sz":1,"vout_sz":1,"lock_time":0,"size":135,"in":[{"prev_out":{"hash":"0000000000000000000000000000000000000000000000000000000000000000","n":4294967295},"coinbase":"04f2b9441a022a01"}],"out":[{"value":"50.01000000","scriptPubKey":"04d879d5ef8b70cf0a33925101b64429ad7eb370da8ad0b05c9cd60922c363a1eada85bcc2843b7378e226735048786c790b30b28438d22acfade24ef047b5f865 OP_CHECKSIG"}]},{"hash":"60c25dda8d41f8d3d7d5c6249e2ea1b05a25bf7ae2ad6d904b512b31f997e1a1","ver":1,"vin_sz":1,"vout_sz":2,"lock_time":0,"size":259,"in":[{"prev_out":{"hash":"738d466ff93e7857d07138b5a5a75e83a964e3c9977d2603308ecc9b667962ad","n":0},"scriptSig":"30460221009805aa00cb6f80ca984584d4ca40f637fc948e3dbe159ea5c4eb6941bf4eb763022100e1cc0852d3f6eb87839edca1f90169088ed3502d8cde2f495840acac69eefc9801 0486477e6a23cb25c9a99f0c467c6fc86197e718ebfd41d1aef7cc3cbd75197c1f1aaba985b22b366a0729ccb8aa38277809d6d218cf4077ac9f29a953b5435222"}],"out":[{"value":"0.50000000","scriptPubKey":"OP_DUP OP_HASH160 6f31097e564b9d54ebad662d5c4b5621c18ff523 OP_EQUALVERIFY OP_CHECKSIG"},{"value":"29.00000000","scriptPubKey":"OP_DUP OP_HASH160 7228033b48b380900501c39c61da4ab453ca88e8 OP_EQUALVERIFY OP_CHECKSIG"}]},{"hash":"01f314cdd8566d3e5dbdd97de2d9fbfbfd6873e916a00d48758282cbb81a45b9","ver":1,"vin_sz":3,"vout_sz":2,"lock_time":0,"size":617,"in":[{"prev_out":{"hash":"c9b85295d9301d18e319bfe395ccaed6953c85c437dfc7cef97120c441f3195a","n":0},"scriptSig":"3044022025bca5dc0fe42aca5f07c9b3fe1b3f72113ffbc3522f8d3ebb2457f5bdf8f9b2022030ff687c00a63e810b21e447d3a57b2749ebea553cab763eb9b99e1b9839653b01 04469f7eb54b90d90106b1a5412b41a23516028e81ad35e0418a4460707ae39a4bf0101b632260fb08979aba0ceea576b5400c7cf30b539b055ec4c0b96ab00984"},{"prev_out":{"hash":"dac1581d713ef11db9710f202f2103cc918af29499ddbd11352bb7b6f4d3725b","n":0},"scriptSig":"3046022100fbef2589b7c52a3be0fd8dd3624445da9c8930f0e51f6a33d76dc0ca0304473d0221009ec433ca6a9f16184db46468ff39cafaa9643021e0c66a1de1e6f9a61209279001 04b27f4de096ac6431eec4b807a0d3db3e9f9be48faab692d5559624acb1faf4334dd440ebf32a81506b7c49d8cf40e4b3f5c6b6e99fcb6d3e8a298174bd2b348d"},{"prev_out":{"hash":"430fbe9aea0fc6ceb6065bf3a0e911a8c6b1ca438e16a3338471518873942e29","n":1},"scriptSig":"30440220582813f2c2d7cbb84521f81d6c2a1147e5296e90bee05f583b3df108fdac72010220232b43a2e596cef59f82c8bfff1a310d85e7beb3e607076ff8966d6d374dc12b01 04a8514ca51137c6d8a4befa476a7521197b886fceafa9f5c2830bea6df62792a6dd46f2b26812b250f13fad473e5cab6dcceaa2d53cf2c82e8e03d95a0e70836b"}],"out":[{"value":"0.01000000","scriptPubKey":"OP_DUP OP_HASH160 429e6bd3c9a9ca4be00a4b2b02fd4f5895c14059 OP_EQUALVERIFY OP_CHECKSIG"},{"value":"4.85000000","scriptPubKey":"OP_DUP OP_HASH160 e55756cb5395a4b39369d0f1f0a640c12fd867b2 OP_EQUALVERIFY OP_CHECKSIG"}]},{"hash":"b519286a1040da6ad83c783eb2872659eaf57b1bec088e614776ffe7dc8f6d01","ver":1,"vin_sz":2,"vout_sz":1,"lock_time":0,"size":404,"in":[{"prev_out":{"hash":"7ae1847583b78ea9534b2da74134aa89a4d013a6b31631e71a27b9026435a8c8","n":1},"scriptSig":"30440220771ae3ed7f2507f5682d6f63f59fa17187f1c4bdb33aa96373e73d42795d23b702206545376155d36db49560cf9c959d009f8e8ea668d93f47a4c8e9b27dc6b3302301 048a976a8aa3f805749bf62df59168e49c163abafde1d2b596d685985807a221cbddf5fb72687678c41e35de46db82b49a48a2b9accea3648407c9ce2430724829"},{"prev_out":{"hash":"fec71848ed96aeef4bc10303b182aab03e565648ed3f6e0b36f748921c11f0a4","n":1},"scriptSig":"304602210087fc57bd3ce0a03f0f7a3300a84dde8d5eba23dfdc64b8f2c17950c5213158d102210098141fbd22da33629cfc25b84d49b397144e1ec6287e0edd53dbb426aa6a72ed01 04dee3ef362ae99b46422c8028f900a138c872776b2fcffed3f9cd02ee4b068a6df516a50249ae6d8f420f9ce19cdfc4663961296a71cd62b04a2c8a14ff89b1d0"}],"out":[{"value":"0.15000000","scriptPubKey":"OP_DUP OP_HASH160 e43f7c61b3ef143b0fe4461c7d26f67377fd2075 OP_EQUALVERIFY OP_CHECKSIG"}]}],"mrkl_tree":["51d37bdd871c9e1f4d5541be67a6ab625e32028744d7d4609d0c37747b40cd2d","60c25dda8d41f8d3d7d5c6249e2ea1b05a25bf7ae2ad6d904b512b31f997e1a1","01f314cdd8566d3e5dbdd97de2d9fbfbfd6873e916a00d48758282cbb81a45b9","b519286a1040da6ad83c783eb2872659eaf57b1bec088e614776ffe7dc8f6d01","0d0eb1b4c4b49fd27d100e9cce555d4110594661b1b8ac05a4b8879c84959bd4","bfae954bdb9653ceba3721e85a122fba3a585c5762b5ca5abe117b30c36c995e","2b12fcf1b09288fcaff797d71e950e71ae42b91e8bdb2304758dfcffc2b620e3"]}';

    console.log( "Genesis Result = " + generateGenesisHash(raw_mrkl_source) );

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

        //Extract the fields from the json object
        var version = jsonObj.ver;
        var time = jsonObj.time;
        var bits = jsonObj.bits;
        var nonce = jsonObj.nonce;
        var prevBlock = jsonObj.prev_block;
        var mrkl_root = calcRootHash(jsonObj);
        console.log("Calculated mrkl_root is: " + mrkl_root);

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
})();
