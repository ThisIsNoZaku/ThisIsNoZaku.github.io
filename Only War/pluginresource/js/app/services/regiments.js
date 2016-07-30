define(["require", "exports", "../types/character/Characteristic", "../types/character/Talent", "../types/character/Regiment", "../types/character/Trait", "../types/character/CharacterModifier", "../types/regiment/SpecialAbility"], function (require, exports, Characteristic_1, Talent_1, Regiment_1, Trait_1, CharacterModifier_1, SpecialAbility_1) {
    "use strict";
    /**
     * Created by Damien on 7/12/2016.
     */
    class RegimentService {
        constructor($resource, $q, characteroptions, placeholders) {
            this._regiments = $q.all({
                regiments: $resource("pluginresource/Regiment/Regiments.json").query().$promise,
                placeholders: placeholders
            }).then(function (result) {
                return result.regiments.map(regiment => {
                    var characteristics = new Map();
                    for (var characteristicName in regiment['fixed modifiers'].characteristics) {
                        characteristics.set(Characteristic_1.Characteristic.characteristics.get(characteristicName), regiment['fixed modifiers'].characteristics[characteristicName]);
                    }
                    var aptitudes = regiment['fixed modifiers'].aptitudes;
                    var characterSkills = new Map();
                    var skillContainer = regiment['fixed modifiers'].skills;
                    for (var skillName in skillContainer) {
                        characterSkills.set(result.placeholders.replace(skillName, "skill"), skillContainer[skillName]);
                    }
                    var characterTalents = new Array();
                    for (var talentDescription of regiment['fixed modifiers'].talents) {
                        var talentName = talentDescription.substring(0, talentDescription.indexOf("(") == -1 ? talentDescription.length : talentDescription.indexOf("(")).trim();
                        let specialization = talentDescription.substring(talentDescription.indexOf("(") + 1, talentDescription.indexOf((")")));
                        var talent = result.placeholders.replace(talentDescription, "talent");
                        characterTalents.push(new Talent_1.Talent(talent.name, talent.source, talent.tier, talent.aptitudes, specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                    }
                    var characterTraits = new Array();
                    if (regiment['fixed modifiers'].traits) {
                        for (var traitDescription of regiment['fixed modifiers'].traits) {
                            var traitName = traitDescription.substring(0, traitDescription.indexOf("(") == -1 ? traitDescription.length : traitDescription.indexOf("(")).trim();
                            var specialization = traitDescription.substring(traitDescription.indexOf("(") + 1, traitDescription.indexOf(")"));
                            var trait = result.placeholders.replace(traitDescription, "trait");
                            characterTraits.push(new Trait_1.Trait(trait.name, trait.description));
                        }
                    }
                    var kit = new Map();
                    for (var itemDescription of regiment['fixed modifiers']['character kit']) {
                        var item = result.placeholders.replace(itemDescription.item, "item");
                        kit.set(item, itemDescription.count);
                    }
                    var wounds = regiment['fixed modifiers'].wounds;
                    var favoredWeapons = [];
                    for (var favoredWeapon of regiment['fixed modifiers']['favored weapons']) {
                        favoredWeapons.push(result.placeholders.replace({ "name": favoredWeapon }, "item"));
                    }
                    var specialAbilities = [];
                    $.each(regiment['fixed modifiers']['special abilities'], function (i, ability) {
                        specialAbilities.push(new SpecialAbility_1.SpecialAbility(ability.name, ability.description));
                    });
                    var optionalModifiers = Array();
                    if (regiment['optional modifiers']) {
                        for (var optional of regiment['optional modifiers']) {
                            optionalModifiers.push(new CharacterModifier_1.SelectableModifier(optional.selections, optional.options.map(optionGroup => {
                                optionGroup.description = optionGroup.map(o => o.value).join(" or ");
                                return optionGroup.map(option => {
                                    option.value = result.placeholders.replace(option.value, option.property);
                                    var options = [];
                                    return option;
                                });
                            })));
                        }
                    }
                    return new Regiment_1.Regiment(regiment.name, characteristics, characterSkills, characterTalents, regiment['fixed modifiers'].aptitudes, characterTraits, kit, wounds, optionalModifiers, favoredWeapons, specialAbilities);
                });
            });
        }
        get regiments() {
            return this._regiments;
        }
    }
    exports.RegimentService = RegimentService;
});
//# sourceMappingURL=regiments.js.map