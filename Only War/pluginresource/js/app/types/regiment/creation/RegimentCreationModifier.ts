/**
 * Created by Damien on 7/28/2016.
 */
import {SpecialAbility} from "../SpecialAbility";
import {SelectableModifier} from "../../character/CharacterModifier";
import {Weapon} from "../../character/items/Weapon";
import {Item} from "../../character/items/Item";
import {Trait} from "../../character/Trait";
import {SkillDescription} from "../../character/Skill";
import {Talent} from "../../character/Talent";
import {Characteristic} from "../../character/Characteristic";
/**
 * A modifier that changes the stats of a regiment being created.
 */
export class RegimentCreationModifier{
    private _name:string = "";
    private _characteristics:Map<Characteristic, number> = new Map();
    private _talents:Array<Talent> = [];
    private _skills:Map<SkillDescription, number> = new Map();
    private _traits:Array<Trait> = [];
    private _aptitudes:Array<string> = [];
    private _kit:Map<Item,number> = new Map();
    private _wounds:number = 0;
    private _favoredWeapons:Array<Weapon> = [];
    private _optionalModifiers:Array<SelectableModifier> = [];
    private _specialAbilities:Array<SpecialAbility> = [];
}