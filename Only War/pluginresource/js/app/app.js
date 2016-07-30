require(["angular", "bootstrap", "ui-router", "angular-resource", "angular-ui", "dragdrop", "angular-filter", "cookies",
        "app/modifier-controller", "app/characteristics/characteristics-controller", "app/specialty/starting-powers-controller", "app/nav/selection-modal", "app/sheet/sheet-controller", "app/nav/confirmation-modal", "app/finalize/FinalizePageController", "app/sheet/characteristic-tooltip-controller", "app/sheet/armor-tooltip-controller", "app/regiments/regiment-creation-controller",
        "app/services/selection", "app/services/modifier-service", "app/services/character", "app/services/CharacterOptionsService", "app/services/regiments", "app/services/specialties", "app/services/dice", "app/services/characteristic-tooltip-service", "app/services/armor-tooltip-service", "app/services/regimentoptions", "app/services/option-selection", "app/services/tutorials", "app/services/PlaceholderReplacement",
        "app/filters/OptionalSelectionModalOptionDisplayFilter", "app/filters/OptionSummaryDisplayFilter"
    ],
    function (angular, bootstrap, uirouter, resource, angularui, dragdrop, angularFilter, cookies,
              modifierControllerFactory, characteristicsController, startingPowersController, selectionModalController, sheetController, confirmationController, finalizeController, characteristicTooltipController, armorTooltipController, regimentCreationController,
              selectionService, modifierService, characterService, characterOptions, regimentsProvider, specialtyProvider, diceService, characteristicTooltipService, armorTooltipService, regimentOptions, optionSelection, tutorials, placeholderReplacement,
              OptionSelectionModalOptionDisplayFilter, OptionSummaryDisplayFilter) {
        var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap", "ngDragDrop", "angular.filter"]);

        app.config(function ($stateProvider) {
            $stateProvider.state("default", {
                url: "",
                onEnter: function ($state) {
                    $state.go("sheet");
                }
            }).state("sheet", {
                url: "/",
                templateUrl: "pluginresource/templates/sheet.html",
                controller: sheetController,
            }).state("regiment", {
                url: "/regiment",
                templateUrl: "pluginresource/templates/regiment-specialty-page.html",
                controller: modifierControllerFactory("regiments"),
                data: {
                    complete: false
                }
            }).state("characteristics", {
                url: "/characteristics",
                templateUrl: "pluginresource/templates/characteristics.html",
                controller: characteristicsController,
                data: {
                    complete: false
                }
            }).state("specialty", {
                url: "/specialty",
                templateUrl: "pluginresource/templates/regiment-specialty-page.html",
                controller: modifierControllerFactory("specialties"),
                data: {
                    complete: false
                }
            }).state("finalize", {
                url: "/finalize",
                templateUrl: "pluginresource/templates/finalize.html",
                controller: finalizeController.FinalizePageController,
                data: {
                    complete: false
                }
            }).state("createRegiment", {
                url: "/regiment/create",
                templateUrl: "pluginresource/templates/regiment-creation.html",
                controller: regimentCreationController
            }).state("modal", {
                abstract: true
            }).state("modal.tutorial", {
                onEnter: function ($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: "pluginresource/templates/tutorial.html"
                    })
                }
            }).state("modal.selection", {
                abstract: true
            }).state("modal.selection.modifier", {
                onEnter: function ($state, $uibModal, $stateParams, optionselection, selection) {
                    console.log("modal.selection.modifier");
                    var modal = $uibModal.open({
                        templateUrl: "pluginresource/templates/selection-modal.html",
                        controller: selectionModalController
                    });
                    modal.result.then(function (result) {
                        optionselection.selected = selection.selected;
                        optionselection.applySelection();
                        $stateParams['on-completion-callback']();
                        $state.go($state.previous.name);
                    }, function (error) {
                        $state.go($state.previous.name);
                    });
                },
                params: {
                    "on-completion-callback": {
                        value: function () {
                        }
                    }
                }
            });
        });

        //Register services
        app.factory("selection", selectionService);
        app.factory("optionselection", optionSelection);
        app.factory("characterService", characterService);
        app.factory("characteroptions", characterOptions.CharacterOptionsService);
        app.factory("dice", diceService);
        app.factory("characteristicTooltipService", characteristicTooltipService);
        app.factory("armorTooltipService", armorTooltipService);
        app.factory("regimentOptions", regimentOptions);
        app.factory("cookies", function () {
            return cookies
        });
        app.factory("tutorials", tutorials);
        app.service("regiments", regimentsProvider.RegimentService);
        app.factory("specialties", specialtyProvider.SpecialtyService);
        app.factory("placeholders", function ($q, characteroptions) {
            return $q.all({
                armor: characteroptions.armor,
                items: characteroptions.items,
                powers: characteroptions.powers,
                skills: characteroptions.skills,
                talents: characteroptions.talents,
                traits: characteroptions.traits,
                vehicles: characteroptions.vehicles,
                weapons: characteroptions.weapons
            }).then(function (characteroptions) {
                return new placeholderReplacement.PlaceholderReplacement(characteroptions);
            });
        });

        //Register additional controllers not used by the main pages below
        app.controller("SelectionModalController", selectionModalController);
        app.controller("ConfirmationController", confirmationController);
        app.controller("CharacteristicToolTipController", characteristicTooltipController);
        app.controller("StartingPowersController", startingPowersController);
        app.controller("ArmorTooltipController", armorTooltipController);
        app.controller("RegimentCreationController", regimentCreationController);

        app.run(function ($rootScope, $state, $uibModal) {
            var suppressDialog = false;
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
            });
            $rootScope.$on("$stateChangeError", function (event) {
                console.log(event);
            });
            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                //If transitioning from a top level state to a different toplevel state, the current state is not finished and not suppressing warning dialog
                if (toState !== fromState && $state.topLevelStates.indexOf(toState.name) !== -1 && $state.topLevelStates.indexOf(fromState.name) !== -1 && fromState.data && !fromState.data.complete && !suppressDialog) {
                    var resultHandler = function (result) {
                        if (result) {
                            suppressDialog = true;
                            $state.go(toState);
                        }
                    };
                    e.preventDefault();
                    confirm = $uibModal.open({
                        controller: "ConfirmationController",
                        templateUrl: "pluginresource/templates/confirm-navigation-modal.html"
                    }).result.then(resultHandler);
                }
                suppressDialog = false;
            });
            $("modal-container").on("hidden.bs.modal", function (e) {

            });
            $state.topLevelStates = ["regiment", "sheet", "characteristics", "specialty", "finalize"];
        });

        //Filter for formatting a clickable summary for a selection.
        app.filter('option_summary', function () {
            return OptionSummaryDisplayFilter.filter;
        })
        //Filter for formatting an selectable option in a modal.
        app.filter('modal_option', function () {
            return OptionSelectionModalOptionDisplayFilter.filter;
        });

        angular.bootstrap(document, ['OnlyWar']);

        character = function (value) {
            var characterService = angular.element(document.body).injector().get("character");
            if (value) {
                characterService.character = value;
                angular.element(document.body).injector().get("$state").reload();
            } else {
                var characterService = angular.element(document.body).injector().get("character");
                return characterService.character;
            }
        };

        exportCharacter = function () {
            var toExport = {};
            var characterService = angular.element(document.body).injector().get("character");
            var character = angular.copy(characterService.character);
            toExport.name = character.name;
            toExport.player = character.player;
            toExport.regiment = character.regiment;
            toExport.specialty = character.specialty;
            toExport.demeanor = character.demeanor;
            toExport.description = character.description;
            toExport.characteristics = character.characteristics;
            Object.keys(toExport.characteristics).map(function (value, index) {
                toExport.characteristics[value] = toExport.characteristics[value].total()
            });
            toExport.skills = character.skills;
            toExport.talents = character.talent;
            toExport.traits = character.traits;
            toExport.wounds = {
                total: character.wounds.total,
                criticalInjuries: character.wounds.criticalInjuries
            };
            toExport.insanity = character.insanity;
            toExport.corruption = character.corruption;
            toExport.speed = {
                half: character.speed.half,
                full: character.speed.full,
                charge: character.speed.charge,
                run: character.speed.run
            };
            toExport.fatePoints = character.fatePoints;
            toExport.equipment = character.equipment;
            toExport.experience = {
                total: character.experience.total,
                available: character.experience.available
            };
            toExport.aptitudes = character.aptitudes.all;
            toExport.psychicPowers = character.psychicPowers;
            toExport.fatigue = character.fatigue;
            return toExport;
        }
        return app;
    }
);