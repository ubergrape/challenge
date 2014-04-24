var server = require('../server');

describe("solve", function() {
    var challenges = [
        // from the riddle description
        ["HARRY",
         "SALLY",
         2],
        ["AA",
         "BB",
         0],
        ["SHINCHAN",
         "NOHARAAA",
         3],
        ["ABCDEF",
         "FBDAMN",
         2],

        // more challenges
        ["G",
         "G",
         1],
        ["GA",
         "GG",
         1],
        ["FOOOOODF",
         "FFFDOOOF",
         5],
        ["XAXXXBXCXDXXXXXXX",
         "YABYYYYYYYYYCYYYD",
         4],
        ["ALKHGADFHGADHFJ",
         "NMBVYXCBXNMYCVN",
         0],
        ["OIZQVJMEXZECUFZCDQZJVOHODJCQVDSZTABPUMGIHBCUOJHQXBESEBTFHCBDYHCC",
         "CPUEXQGKHODQNNCPSAUPWPALVRBDXIVPNCNBUDJOHZZAPRKAIEWBIMGXRJEQLGNP",
         17],

        // challenges with different string length
        ["GG",
         "G",
         1],
        ["G",
         "GG",
         1],
        ["GGGGGXXX",
         "GG",
         2],
        ["GG",
         "GGGGGXXX",
         2],
        ["ABCDABCDABCD",
         "CABCAB",
         6],
        ["S",
         "XSX",
         1]
    ];

    function test_solve(a, b, s) {
        it("should solve '" + a + "', '" + b + "'", function() {
            var solution = server.solve(a, b);
            expect(solution).toBe(s);
        });
    }

    for(var i = 0; i < challenges.length; i++) {
        var a = challenges[i][0];
        var b = challenges[i][1];
        var s = challenges[i][2];
        test_solve(a,b,s);
    }
});

