define(["require", "exports", "../types/character/Characteristic"], function (require, exports, Characteristic_1) {
    "use strict";
    /**
     * Created by Damien on 7/20/2016.
     */
    class CharacteristicSelectionPageController {
        constructor($scope, $uibModal, $state, characterService, dice) {
            this.characteristicValues = new Map();
            $scope["characteristicNames"] = Array.from(Characteristic_1.Characteristic.characteristics.keys());
        }
        ;
    }
    exports.CharacteristicSelectionPageController = CharacteristicSelectionPageController;
});
//# sourceMappingURL=CharacteristicSelectionPageController.js.map