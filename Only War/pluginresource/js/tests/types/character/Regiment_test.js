define(["require", "exports", "../../../app/types/character/Regiment", "../../../app/types/character/Characteristic", "../../../app/types/character/Character", "../../../app/types/character/Skill", "../../../app/types/character/Talent", "../../../app/types/character/Trait", "../../../app/types/character/items/Item"], function (require, exports, Regiment_1, Characteristic_1, Character_1, Skill_1, Talent_1, Trait_1, Item_1) {
    "use strict";
    /**
     * Created by Damien on 7/24/2016.
     */
    describe("A regiment", () => {
        var theCharacter;
        beforeEach(() => {
            theCharacter = new Character_1.OnlyWarCharacter();
        });
        it("must be able to modify the characteristics of the character it is added to", () => {
            var characteristics = new Map();
            characteristics.set(Characteristic_1.Characteristic.characteristics.get("Agility"), 5);
            var regiment = new Regiment_1.RegimentBuilder().setCharacteristics(characteristics).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).total).toEqual(5);
        });
        it("must correctly undo any characteristic modifiers it applied when removed", () => {
            var characteristics = new Map();
            characteristics.set(Characteristic_1.Characteristic.characteristics.get("Agility"), 5);
            var regiment = new Regiment_1.RegimentBuilder().setCharacteristics(characteristics).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).total).toEqual(5);
            theCharacter.regiment = null;
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(0);
            expect(theCharacter.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).total).toEqual(0);
        });
        it("must be able to improve the skills of the character it is added to", () => {
            var skills = new Map();
            skills.set(new Skill_1.SkillDescription("Acrobatics", []), 1);
            var regiment = new Regiment_1.RegimentBuilder().setSkills(skills).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.skills.find(skill => {
                return angular.equals(skill.identifier, new Skill_1.SkillDescription("Acrobatics", []));
            })).toBeDefined();
            expect(theCharacter.skills.find(skill => {
                return angular.equals(skill.identifier, new Skill_1.SkillDescription("Acrobatics", []));
            }).rank).toEqual(1);
        });
        it("must correctly undo any skill modifiers it applied when removed", () => {
            var skills = new Map();
            skills.set(new Skill_1.SkillDescription("Acrobatics", []), 1);
            var regiment = new Regiment_1.RegimentBuilder().setSkills(skills).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.skills.find(skill => {
                return angular.equals(skill.identifier, new Skill_1.SkillDescription("Acrobatics", []));
            })).toBeDefined();
            expect(theCharacter.skills.find(skill => {
                return angular.equals(skill.identifier, new Skill_1.SkillDescription("Acrobatics", []));
            }).rank).toEqual(1);
            theCharacter.regiment = null;
            expect(theCharacter.skills.find(skill => {
                return angular.equals(skill.identifier, new Skill_1.SkillDescription("Acrobatics", []));
            })).not.toBeDefined();
        });
        it("must be able to add talents to the character", () => {
            var talents = [new Talent_1.Talent("", "", 0, [], false)];
            var regiment = new Regiment_1.RegimentBuilder().setTalents(talents).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.talents.find(t => {
                return t.name === "";
            })).toBeDefined();
        });
        it("must correctly remove any talents it added when removed", () => {
            var talents = [new Talent_1.Talent("", "", 0, [], false)];
            var regiment = new Regiment_1.RegimentBuilder().setTalents(talents).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.talents.find(t => {
                return t.name === "";
            })).toBeDefined();
            theCharacter.regiment = null;
            expect(theCharacter.talents.find(t => {
                return t.name === "";
            })).not.toBeDefined();
        });
        it("must be able to add traits to the character", () => {
            var traits = [new Trait_1.Trait("", "")];
            var regiment = new Regiment_1.RegimentBuilder().setTraits(traits).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.find(t => {
                return t.name === "";
            })).toBeDefined();
        });
        it("must correctly remove any traits it added when removed", () => {
            var traits = [new Trait_1.Trait("", "")];
            var regiment = new Regiment_1.RegimentBuilder().setTraits(traits).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.find(t => {
                return t.name === "";
            })).toBeDefined();
            theCharacter.regiment = null;
            expect(theCharacter.traits.find(t => {
                return t.name === "";
            })).not.toBeDefined();
        });
        it("must correctly set the regiment modifier to wounds of the character", () => {
            var regiment = new Regiment_1.RegimentBuilder().setWounds(1).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.wounds.total).toEqual(1);
            expect(theCharacter.wounds.regimentModifier).toEqual(1);
        });
        it("must unset the regiment modifier to wounds of the character when removed", () => {
            var regiment = new Regiment_1.RegimentBuilder().setWounds(1).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.wounds.total).toEqual(1);
            expect(theCharacter.wounds.regimentModifier).toEqual(1);
            theCharacter.regiment = null;
            expect(theCharacter.wounds.total).toEqual(0);
            expect(theCharacter.wounds.regimentModifier).toEqual(0);
        });
        it("must be able to add aptitudes to the character", () => {
            var regiment = new Regiment_1.RegimentBuilder().setAptitudes(["Aptitude"]).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(0);
        });
        it("must correctly remove any aptitudes it added when removed", () => {
            var regiment = new Regiment_1.RegimentBuilder().setAptitudes(["Aptitude"]).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(0);
            theCharacter.regiment = null;
            expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(-1);
        });
        it("must be able to add items to the character kit", () => {
            var kit = new Map();
            var item = new Item_1.Item("", Item_1.ItemType.Other, Item_1.Availability.Common);
            kit.set(item, 1);
            var regiment = new Regiment_1.RegimentBuilder().setKit(kit).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.kit.get(item)).toEqual(1);
        });
        it("must remove items it added to the character when removed", () => {
            var kit = new Map();
            var item = new Item_1.Item("", Item_1.ItemType.Other, Item_1.Availability.Common);
            kit.set(item, 1);
            var regiment = new Regiment_1.RegimentBuilder().setKit(kit).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.kit.get(item)).toEqual(1);
            theCharacter.regiment = null;
            expect(theCharacter.kit.get(item)).not.toBeDefined();
        });
    });
});
//# sourceMappingURL=Regiment_test.js.map