/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
import {Item} from "../../../app/types/character/items/Item";
import {KitModifier} from "../../../app/types/regiment/KitModifier";
/**
 * Created by Damien on 7/24/2016.
 */
describe("A kit modifier", ()=>{
    it("can add a new item to the character's kit", ()=>{
        var kit = new Map<Item, number>();
        var modifier = new KitModifier("",0,kit=>{return true},kit=>{
            
        });
    });
});