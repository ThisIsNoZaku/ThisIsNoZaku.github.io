import { Characteristic } from "../types/character/Characteristic";
import { Talent } from "../types/character/Talent";
import { Armor } from "../types/character/items/Armor";
import { Weapon } from "../types/character/items/Weapon";
import { Item, ItemType, Availability } from "../types/character/items/Item";
import { Prerequisite } from "../types/Prerequisite";
import { SpecialtyType } from "../types/character/Specialty";
/**
 * Created by Damien on 7/12/2016.
 */
export class CharacterOptionsService {
    constructor($resource, $q, $log) {
        this._talents = $resource("pluginresource/Character/Talents.json").query().$promise.then(talents => {
            return talents.map(talent => {
                if (!talent.prerequisites) {
                    talent.prerequisites = [];
                }
                var predicates = [];
                /*Each prerequisite object defined in the json is transformed into a predicate function.
                 */
                talent.prerequisites.forEach((prerequisite) => {
                    /**
                     * Each sub entry may be an object or an array of matcher objects.
                     * If an array, the entire prerequisite matches if ANY of the subprerequisites within the array
                     * matches.
                     */
                    if (!Array.isArray(prerequisite)) {
                        prerequisite = [prerequisite];
                    }
                    var subpredicates = [];
                    prerequisite.forEach(subprerequisite => {
                        switch (subprerequisite.property) {
                            case "characteristic":
                                {
                                    subpredicates.push((character) => {
                                        return character.characteristics.get(Characteristic.characteristics.get(prerequisite.value.name)) >= prerequisite.value.rating;
                                    });
                                    break;
                                }
                            case "talent":
                                {
                                    subpredicates.push((character) => {
                                        return character.talents.find(characterTalent => {
                                            return characterTalent.name === talent.name && characterTalent.specialization === characterTalent.specialization;
                                        });
                                    });
                                    break;
                                }
                            case "skill":
                                {
                                    subpredicates.push((character) => {
                                        return character.skills.find(skill => {
                                            return skill.identifier.name === prerequisite.value.name && skill.rank === prerequisite.value.rating;
                                        });
                                    });
                                    break;
                                }
                            case "psy rating":
                                {
                                    subpredicates.push((character) => {
                                        return character.powers.psyRating === prerequisite.rating;
                                    });
                                }
                            case "character kit":
                                {
                                    subpredicates.push((character) => {
                                        var matchFound = false;
                                        for (let item of character.kit.keys()) {
                                            for (let property in prerequisite.value) {
                                                if (item[property] !== prerequisite.value[property]) {
                                                    matchFound = false;
                                                    break;
                                                }
                                                matchFound = true;
                                            }
                                            if (matchFound) {
                                                break;
                                            }
                                        }
                                        return matchFound;
                                    });
                                }
                            case "trait":
                                {
                                    subpredicates.push((character) => {
                                        return character.traits.find((trait) => {
                                            return trait.name == prerequisite.value.name;
                                        });
                                    });
                                    break;
                                }
                            case "power":
                                {
                                    subpredicates.push((character) => {
                                        return character.powers.powers.find(power => {
                                            return power.name === prerequisite.value;
                                        });
                                    });
                                    break;
                                }
                            case "specialty type":
                                {
                                    subpredicates.push((character) => {
                                        switch (subprerequisite.value) {
                                            case "Guardsman":
                                                return character.specialty.specialtyType === SpecialtyType.Guardsman;
                                            case "Specialist":
                                                return character.specialty.specialtyType === SpecialtyType.Specialist;
                                        }
                                    });
                                    break;
                                }
                            default:
                                {
                                    $log.error("Unknown property " + subprerequisite.property);
                                }
                        }
                        predicates.push((target) => {
                            var subpredicates = subpredicates;
                            return subpredicates.find((subpredicate) => {
                                return subpredicate(target);
                            });
                        });
                    });
                });
                return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, talent.specialization, new Prerequisite((target) => {
                    for (var predicate of predicates) {
                        if (!predicate(target)) {
                            return false;
                        }
                    }
                    ;
                    return true;
                }));
            });
        });
        this._skills = $resource("pluginresource/Character/Skills.json").query().$promise;
        this._powers = $resource("pluginresource/Character/Powers.json").query().$promise;
        this._weapons = $resource("pluginresource/Character/Weapons.json").query().$promise.then(function (weapons) {
            return weapons.map(weapon => {
                switch (weapon.availability) {
                    case "Ubiquitous":
                        weapon.availability = Availability.Ubiquitous;
                        break;
                    case "Abundant":
                        weapon.availability = Availability.Abundant;
                        break;
                    case "Plentiful":
                        weapon.availability = Availability.Plentiful;
                        break;
                    case "Common":
                        weapon.availability = Availability.Common;
                        break;
                    case "Average":
                        weapon.availability = Availability.Average;
                        break;
                    case "Scarce":
                        weapon.availability = Availability.Scarce;
                        break;
                    case "Rare":
                        weapon.availability = Availability.Rare;
                        break;
                    case "Very Rare":
                        weapon.availability = Availability.Very_Rare;
                        break;
                    case "Extremely Rare":
                        weapon.availability = Availability.Extremely_Rare;
                        break;
                    case "Near Unique":
                        weapon.availability = Availability.Near_Unique;
                        break;
                    case "Unique":
                        weapon.availability = Availability.Unique;
                        break;
                }
                return new Weapon(weapon.name, weapon.availability, weapon.class, weapon.range, weapon.rof, weapon.damage, weapon.pen, weapon.clip, weapon.reload, weapon['special qualities'], weapon.weight);
            });
        });
        this._armor = $resource("pluginresource/Character/Armor.json").query().$promise.then(function (armor) {
            return armor.map(armor => {
                return new Armor(armor.name, armor.availability, armor.locations, armor.ap, armor.weight, armor);
            });
        });
        this._items = $resource("pluginresource/Character/Items.json").query().$promise.then(function (items) {
            return items.map(item => {
                return new Item(item.name, ItemType.Other, item.availability, item.weight);
            });
        });
        this._vehicles = $resource("pluginresource/Character/Vehicles.json").query().$promise;
        this._traits = $resource("pluginresource/Character/Traits.json").query().$promise;
        this._fatePointRolls = $resource("pluginresource/Character/fatepoints.json").get().$promise;
    }
    get talents() {
        return this._talents;
    }
    get skills() {
        return this._skills;
    }
    get powers() {
        return this._powers;
    }
    get fatePointRolls() {
        return this._fatePointRolls;
    }
    get weapons() {
        return this._weapons;
    }
    get armor() {
        return this._armor;
    }
    get items() {
        return this._items;
    }
    get vehicles() {
        return this._vehicles;
    }
    get traits() {
        return this._traits;
    }
}
//# sourceMappingURL=CharacterOptionsService.js.map