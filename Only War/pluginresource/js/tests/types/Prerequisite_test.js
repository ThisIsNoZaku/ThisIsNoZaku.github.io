define(["require", "exports", "../../app/types/Prerequisite", "../../app/types/character/Character", "../../app/types/character/Characteristic"], function (require, exports, Prerequisite_1, Character_1, Characteristic_1) {
    "use strict";
    describe("A prerequisite", () => {
        it("must always match with an no matcher object", () => {
            var prerequisite = new Prerequisite_1.Prerequisite();
            var character = new Character_1.OnlyWarCharacter();
            expect(prerequisite.match(character)).toEqual(true);
        });
        it("must match only if all predicate functions match", () => {
            var character = new Character_1.OnlyWarCharacter();
            character.name = "Coolguy";
            var prerequisite = new Prerequisite_1.Prerequisite((target) => {
                return target.name == "Coolguy"
                    && target.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).total == 0;
            });
            expect(prerequisite.match(character)).toEqual(true);
        });
    });
});
//# sourceMappingURL=Prerequisite_test.js.map