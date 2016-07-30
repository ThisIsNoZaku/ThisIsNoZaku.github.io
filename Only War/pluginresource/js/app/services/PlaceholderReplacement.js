define(["require", "exports", "../types/character/Talent", "../types/character/items/Item", "../types/character/Characteristic"], function (require, exports, Talent_1, Item_1, Characteristic_1) {
    "use strict";
    /**
     * Created by Damien on 7/15/2016.
     */
    class PlaceholderReplacement {
        constructor(characteroptions) {
            this._characteroptions = characteroptions;
        }
        /**
         * Attempt to get the actual value for the given placeholder as the given type.
         *
         * The types are skill, talent, item power.
         * @param placeholder
         * @param type
         */
        replace(placeholder, type) {
            switch (type) {
                case "talent":
                    {
                        var talentName = placeholder.substring(0, placeholder.indexOf("(") == -1 ? placeholder.length : placeholder.indexOf("(")).trim();
                        var specialization = placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")"));
                        var talent = this._characteroptions.talents.find(talent => {
                            return talent.name === talentName;
                        });
                        if (!talent) {
                            throw "Tried to find a replacement for talent " + placeholder + " but failed.";
                        }
                        return new Talent_1.Talent(talent.name, talent.source, talent.tier, talent.aptitudes, specialization, talent.prerequisites);
                    }
                case "item":
                    {
                        var item = this._characteroptions.items.find(item => {
                            return item.name === placeholder.name;
                        });
                        if (!item) {
                            item = this._characteroptions.weapons.find(weapon => {
                                return weapon.name === placeholder.name;
                            });
                        }
                        if (!item) {
                            item = this._characteroptions.armor.find(armor => {
                                return armor.name === placeholder.name;
                            });
                        }
                        if (!item) {
                            item = this._characteroptions.vehicles.find(vehicle => {
                                return vehicle.name === placeholder.name;
                            });
                        }
                        if (!item) {
                            console.log("Tried to find item for " + placeholder.name + " but failed.");
                            item = new Item_1.Item(placeholder.name, Item_1.ItemType.Other, Item_1.Availability.Common);
                            item['main weapon'] = placeholder['main weapon'];
                            item['armor'] = placeholder['armor'];
                        }
                    }
                    return item;
                case "skill":
                    {
                        var skillName = placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(0, placeholder.indexOf("(")).trim();
                        var skill = this._characteroptions.skills.find(function (skill) {
                            return skill.name === skillName;
                        });
                        if (skill.specialization) {
                            skill.specialization = placeholder.indexOf("(") === -1 ? null : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                            placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                        }
                        return skill;
                    }
                case "characteristic":
                    {
                        return Characteristic_1.Characteristic.characteristics.get(placeholder);
                    }
                case "trait":
                    {
                        var traitName = placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(0, placeholder.indexOf("(")).trim();
                        var rating = placeholder.indexOf("(") === -1 ? null : Number.parseInt(placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")));
                        var foundTrait = this._characteroptions.traits.find((trait) => {
                            return trait.name === traitName;
                        });
                        foundTrait = angular.copy(foundTrait);
                        foundTrait.rating = rating;
                        return foundTrait;
                    }
                default:
                    throw "Incorrect type name, must be skill, talent, item or power.";
            }
        }
    }
    exports.PlaceholderReplacement = PlaceholderReplacement;
});
//# sourceMappingURL=PlaceholderReplacement.js.map