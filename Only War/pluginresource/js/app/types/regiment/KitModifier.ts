import {Item} from "../character/items/Item";
/**
 * Created by Damien on 7/24/2016.
 */
export class KitModifier{
    private _description:string;
    private _kitPointCost:number;
    private _effect:EffectDescriptor;
    private _matcher:Function;
    private _appliedTo;

    constructor(description:string, kitPointCost:number, matcher:Function, effect:Function) {
        this._description = description;
        this._kitPointCost = kitPointCost;
        this._effect = effect;
        this._matcher = matcher;
    }

    get description():string {
        return this._description;
    }

    get kitPointCost():number {
        return this._kitPointCost;
    }

    canAffect(item:Item){
        return this._matcher(item);
    }

    apply(kit:Map<Item, number>){
        this._appliedTo = kit;
    }

    unapply(){
        this._appliedTo = null;
    }
}

class EffectDescriptor{

}