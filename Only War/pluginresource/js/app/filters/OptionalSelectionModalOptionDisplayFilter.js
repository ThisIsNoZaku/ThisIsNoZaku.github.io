define(["require", "exports", "../types/character/items/Item"], function (require, exports, Item_1) {
    "use strict";
    /**
     * Created by Damien on 7/29/2016.
     */
    function filter(inVal) {
        return inVal.map((option) => {
            var out = "";
            switch (option.property) {
                case "talent":
                    return option.value.specialization ? option.value.name + " (" + option.value.specialization + ")" : option.value.name;
                case "skill":
                    return option.value.specialization ? option.value.skill.name
                        + " (" + option.value.skill.specialization
                        + ") +" + (option.value.rank - 1) * 10
                        : option.value.skill.name + " +" + (option.value.rank - 1) * 10;
                case "character kit":
                    var itemDescription = option.value.count + " x ";
                    var itemCraftsmanship = option.value.item.craftsmanship;
                    if (itemCraftsmanship !== Item_1.Craftsmanship.Common) {
                        switch (itemCraftsmanship) {
                            case Item_1.Craftsmanship.Best:
                                itemDescription += "Best craftsmanship ";
                                break;
                            case Item_1.Craftsmanship.Good:
                                itemDescription += "Good craftsmanship ";
                                break;
                            case Item_1.Craftsmanship.Poor:
                                itemDescription += "Poor craftsmanship ";
                                break;
                        }
                    }
                    itemDescription += option.value.item.name;
                    var itemUpgrades = option.value.item.upgrades;
                    if (itemUpgrades) {
                        itemDescription += " with " + itemUpgrades.join(", ");
                    }
                    return itemDescription;
            }
        }).join(", ");
    }
    exports.filter = filter;
});
//# sourceMappingURL=OptionalSelectionModalOptionDisplayFilter.js.map