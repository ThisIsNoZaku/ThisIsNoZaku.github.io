define(["require", "exports", "../../../app/types/regiment/KitModifier"], function (require, exports, KitModifier_1) {
    "use strict";
    /**
     * Created by Damien on 7/24/2016.
     */
    describe("A kit modifier", () => {
        it("can add a new item to the character's kit", () => {
            var kit = new Map();
            var modifier = new KitModifier_1.KitModifier("", 0, kit => { return true; }, kit => {
            });
        });
    });
});
//# sourceMappingURL=kitModifier_test.js.map