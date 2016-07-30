define(["require", "exports", "../../app/characteristics/CharacteristicSelectionPageController", "../../app/types/character/Characteristic", "angular"], function (require, exports, CharacteristicSelectionPageController_1, Characteristic_1, angular) {
    "use strict";
    /**
     * Created by Damien on 7/20/2016.
     */
    describe("The  page controller", () => {
        var mockScope, mockUibModal, mockState, mockCharacterService, mockDice;
        var theController;
        beforeEach(angular.mock.inject(($rootScope) => {
            mockScope = $rootScope.$new();
            theController = new CharacteristicSelectionPageController_1.CharacteristicSelectionPageController(mockScope, mockUibModal, mockState, mockCharacterService, mockDice);
        }));
        it("must keep track of the rolled value of each characteristic", () => {
            for (var characteristic of Characteristic_1.Characteristic.characteristics.keys()) {
                expect(mockScope["characteristicNames"].find(definedCharacteristic => {
                    return characteristic === definedCharacteristic;
                })).toBeDefined();
            }
            ;
        });
        it("must be able to generate random numbers for all characteristics at once", () => {
        });
    });
});
//# sourceMappingURL=characteristics-controller_test.js.map