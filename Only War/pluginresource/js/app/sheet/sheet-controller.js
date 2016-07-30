define(["../types/character/advancements/CharacterAdvancement", "../types/character/Characteristic"], function (Advancements, Characteristics) {
    return function ($scope, characterService, characteroptions, characteristicTooltipService, armorTooltipService, $uibModal, cookies, $state, tutorials) {
        $scope.character = characterService.character;
        $scope.characteristics = Array.from($scope.character.characteristics.values());

        $scope.characteristicTooltip = function (characteristic) {
            characteristicTooltipService.displayed = characteristic;
        }

        function updateAvailableSkills() {
            characteroptions.skills.then(function (skills) {
                $scope.availableSkills = skills.filter(function (element) {
                    for (var skill in characterService.character.skills) {
                        if (skill === element.name) {
                            return false;
                        }
                    }
                    return true;
                });
            });
        };
        updateAvailableSkills();

        function updateAvailableTalents() {
            characteroptions.talents.then(function (talents) {
                $scope.availableTalents = talents.filter(function (element) {
                    return character && characterService.character && characterService.character.talents && characterService.character.talents.indexOf(element) === -1;
                });
            })
        };
        updateAvailableTalents();
        $scope.newSkillSpecialization;

        $scope.$watch('character.skills', function () {
            updateAvailableTalents();
        });

        $scope.$watch('character.talents.all().length', function (newVal, oldVal) {
            updateAvailableTalents();
        });

        $scope.$watch('newSkill', function (newVal, oldVal) {
            if (newVal) {
                var newSkill = angular.copy($scope.availableSkills[$scope.newSkill]);
                var matchingAptitudes = 0;
                for (var a = 0; a < newSkill.aptitudes; a++) {
                    if (characterService.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
                        matchingAptitudes++;
                    }
                }
                characteroptions.xpCosts().then(function (result) {
                    $scope.newSkillXpCost = parseInt(result.skills.advances[0]['cost by aptitudes'][matchingAptitudes]);
                });
            } else {
                $scope.newSkillXpCost = undefined;
            }
        });
        $scope.$watch('newTalent', function (newVal) {
            if (newVal) {
                var newTalent = angular.copy($scope.availableTalents[$scope.newTalent]);
                var matchingAptitudes = 0;
                for (var a = 0; a < newTalent.aptitudes; a++) {
                    if (characterService.character.aptitudes.all().indexOf(newTalent.aptitudes[a]) !== -1) {
                        matchingAptitudes++;
                    }
                }

                characteroptions.xpCosts().then(function (result) {
                    $scope.newTalentXpCost = new Number(result.talents.advances[newTalent.tier - 1]['cost by aptitudes'][matchingAptitudes]);
                });
            } else {
                $scope.newTalentXpCost = undefined;
            }
        });

        $scope.addSkill = function () {
            if ($scope.newSkill) {
                var selectedSkill = $scope.availableSkills[$scope.newSkill];
                var name = selectedSkill.name;
                if ($scope.newSkillSpecialization) {
                    name += " (" + $scope.newSkillSpecialization + ")";
                }
                var newSkill = {
                    name: name,
                    rating: 1
                };
                characterService.character.experience.addAdvancement($scope.newSkillXpCost, "skills", newSkill);
                $scope.newSkill = null;
                updateAvailableSkills();
            }
        };

        $scope.setSkillLevel = function (skill, newRating) {
            if (skill && newRating) {
                //If the new rating is an increase, add advancements.
                if (newRating > skill.rank) {
                    for (var i = skill.rank; i <= newRating; i++) {
                        $scope.character.experience.addAdvancement(new Advancements.SkillAdvancement(skill.identifier));
                    }
                }
                //If the new rating is lower, attempt to remove advancements.
                else if (newRating < skill.rank) {
                    while (newRating < skill.rank && skill.rankSources.find(function (advancement) {
                        return advancement.constructor.name === "SkillAdvancement";
                    })) {
                        skill.removeRankModifier(skill.rankSources.find(function (advancement) {
                            return advancement.constructor.name === Advancements.SkillAdvancement.name;
                        }));
                    }
                }
            }
        }
        $scope.removeSkill = function (skillName) {
            var indexesToRemove = [];
            $.each(characterService.character.experience._advancementsBought, function (index, element) {
                if (element.property === "skills" && element.value.name == skillName) {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove = indexesToRemove.sort(function (a, b) {
                return b - a;
            });
            $.each(indexesToRemove, function (index, indexToRemove) {
                characterService.character.experience.removeAdvancement(indexToRemove);
            });
            updateAvailableSkills();
        }

        $scope.newTalent;

        $scope.addTalent = function () {
            if ($scope.newTalent) {
                var newTalent = $scope.availableTalents[$scope.newTalent];
                var matchingAptitudes = 0;
                var xpCost;
                for (var a = 0; a < newTalent.aptitudes; a++) {
                    if (characterService.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
                        matchingAptitudes++;
                    }
                }
                newTalent.boughtAsAdvancement = true;
                characteroptions.xpCosts().then(function (result) {
                    xpCost = new Number(result.talents.advances[newTalent.tier - 1]['cost by aptitudes'][matchingAptitudes]);
                    characterService.character.experience.addAdvancement(xpCost, "talents", newTalent);
                    $scope.newTalent = null;
                });
            }
        }

        $scope.removeTalent = function (talent) {
            var talentAdvancement = characterService.character.experience.advancements.find(function (advancement) {
                return advancement.property == "talents" && advancement.value == talent;
            });
            characterService.character.experience.removeAdvancement(talentAdvancement);
        }

        $scope.criticalInjuries = characterService.character.wounds.criticalInjuries;
        $scope.newCriticalInjury;

        $scope.addCriticalInjury = function () {
            if ($scope.newCriticalInjury) {
                $scope.criticalInjuries.push($scope.newCriticalInjury);
                $scope.newCriticalInjury = null;
            }
        };

        $scope.removeCriticalInjury = function (index) {
            $scope.criticalInjuries.splice(index, 1);
        };

        $scope.mentalDisorders = characterService.character.insanity ? characterService.character.insanity.disorders : [];
        $scope.newMentalDisorder;

        $scope.addMentalDisorder = function () {
            if ($scope.newMentalDisorder) {
                $scope.mentalDisorders.push($scope.newMentalDisorder);
                $scope.newMentalDisorder = null;
            }
        };

        $scope.removeMentalDisorder = function (index) {
            $scope.mentalDisorders.splice(index, 1);
        };

        $scope.malignancies = characterService.character.corruption.malignancies;
        $scope.newMalignancy;

        $scope.addMalignancy = function () {
            if ($scope.newMalignancy) {
                $scope.malignancies.push($scope.newMalignancy);
                $scope.newMalignancy = null;
            }
        };

        $scope.removeMalignancy = function (index) {
            $scope.malignancies.splice(index, 1);
        };

        $scope.mutations = characterService.character.corruption.mutations;
        $scope.newMutation;

        $scope.addMutation = function () {
            if ($scope.newMutation) {
                $scope.mutations.push($scope.newMutation);
                $scope.newMutation = null;
            }
        };

        $scope.removeMutation = function (index) {
            $scope.mutations.splice(index, 1);
        };

        $scope.armor = {
            locations: {
                head: {
                    rating: 0,
                    providers: []
                },
                body: {
                    rating: 0,
                    providers: []
                },
                leftArm: {
                    rating: 0,
                    providers: []
                },
                rightArm: {
                    rating: 0,
                    providers: []
                },
                leftLeg: {
                    rating: 0,
                    providers: []
                },
                rightLeg: {
                    rating: 0,
                    providers: []
                }
            },
            update: function () {
                $.each(this.locations, function (i, location) {
                    location.providers = [];
                });
                $.each(characterService.character.kit.armor, function (i, armor) {
                    $.each(armor.item.locations, function (i, location) {
                        switch (location) {
                            case "Head":
                                $scope.armor.locations.head.providers.push(armor);
                                break;
                            case "Body":
                                $scope.armor.locations.body.providers.push(armor);
                                break;
                            case "Right Arm":
                                $scope.armor.locations.rightArm.providers.push(armor);
                                break;
                            case "Left Arm":
                                $scope.armor.locations.leftArm.providers.push(armor);
                                break;
                            case "Right Leg":
                                $scope.armor.locations.rightLeg.providers.push(armor);
                                break;
                            case "Left Leg":
                                $scope.armor.locations.leftLeg.providers.push(armor);
                                break;
                        }
                    });
                });
                $.each(this.locations, function (i, location) {
                    var stackableArmor = location.providers.filter(function (armor) {
                        return armor.tags && armor.tags.contains("cybernetic");
                    });
                    var bestWornArmor = location.providers.reduce(function (previous, current) {
                        //Ignore cybernetics
                        if (current.item.tags && current.item.tags.contains("cybernetic")) {
                            return previous;
                        } else if (!previous || previous.item.ap < current.item.ap) {
                            return current;
                        }
                    }, null);
                    if (bestWornArmor) {
                        stackableArmor.push(bestWornArmor);
                    }
                    location.providers = stackableArmor;
                    location.rating = location.providers.reduce(function (previous, current) {
                        return previous + current.item.ap;
                    }, 0);
                });
            }
        };
        $.each(Array.from(characterService.character.kit.entries()).filter(function (item) {
            return item.type === "Armor";
        }).map(function (element) {
            return element.item
        }), function (index, armor) {
            $.each(armor.locations, function (index, location) {
                switch (location) {
                    case "Left Arm":
                        $scope.armor.leftArm.rating += armor.ap
                        $scope.armor.leftArm.providers.push(armor);
                        break;
                    case "Right Arm":
                        $scope.armor.rightArm.rating += armor.ap
                        $scope.armor.rightArm.providers.push(armor);
                        break;
                    case "Head":
                        $scope.armor.head.rating += armor.ap
                        $scope.armor.head.providers.push(armor);
                        break;
                    case "Body":
                        $scope.armor.body.rating += armor.ap
                        $scope.armor.body.providers.push(armor);
                        break;
                    case "Left Leg":
                        $scope.armor.leftLeg.rating += armor.ap
                        $scope.armor.leftLeg.providers.push(armor);
                        break;
                    case "Right Leg":
                        $scope.armor.rightLeg.rating += armor.ap
                        $scope.armor.rightLeg.providers.push(armor);
                        break;
                }
            });
        });

        $scope.armorTooltip = function (location) {
            armorTooltipService.location = location;
            armorTooltipService.modifiers = $scope.armor.locations[location].providers;
        }

        $scope.$watch('character.psychicPowers.psyRating', function (newVal, oldVal) {
            if (newVal > oldVal) {
                for (var i = oldVal + 1; i <= newVal; i++) {
                    characterService.character.experience.addAdvancement(i * 200, "psy rating", i);
                }
            } else if (newVal < oldVal) {
                var indexesToRemove = [];
                $.each(characterService.character.experience._advancementsBought, function (index, element) {
                    if (element.property === "psy rating" && element.value > newVal) {
                        indexesToRemove.push(index);
                    }
                    ;
                });
                indexesToRemove = indexesToRemove.sort(function (a, b) {
                    return b - a;
                })
                $.each(indexesToRemove, function (index, element) {
                    characterService.character.experience.removeAdvancement(element);
                });
            }
        });

        var updateAvailableWeapons = function () {
            characteroptions.weapons.then(function (weapons) {
                $scope.availableWeapons = weapons.filter(function (element) {
                    var weapons = Array.from(characterService.character.kit.values()).filter(function (item) {
                        return item.type === "Weapon";
                    }).map(function (weapon) {
                        return weapon.item;
                    });
                    return weapons.indexOf(element) === -1;
                });
            })
        };
        updateAvailableWeapons();

        $scope.addNewWeapon = function () {
            characterService.character.kit.push({
                item: $scope.availableWeapons[$scope.newWeapon],
                count: 1
            });
            updateAvailableweapons;
        };
        $scope.removeWeapon = function (index) {
            characterService.character.kit.splice(index);
            $scope.newWeapon = null;
            updateAvailableWeapons();
        }

        $scope.$watch("character.kit.armor.length", function (newVal) {
            $scope.armor.update();
        });

        var updateAvailableArmor = function () {
            characteroptions.armor.then(function (armor) {
                $scope.availableArmor = armor.filter(function (element) {
                    var armor = Array.from(characterService.character.kit.values()).filter(function (item) {
                        return item.type === "Armor";
                    }).map(function (armor) {
                        return armor.item;
                    });
                    return armor.indexOf(element) === -1;
                });
            })
        };
        updateAvailableArmor();

        $scope.addNewArmor = function () {
            characterService.character.kit.push({
                item: $scope.availableArmor[$scope.newArmor],
                count: 1
            });
            updateAvailableArmor();
        };
        $scope.removeArmor = function (index) {
            characterService.character.kit.splice(index);
            $scope.newArmor = null;
            updateAvailableArmor();
        }

        var tutorialShown = cookies.get("tutorial-shown");
        if (!tutorials.introduction) {
            tutorials.show('introduction');
            $state.go("modal.tutorial");
        }

        $scope.availablePowers;
        function updateAvailablePowers() {
            characteroptions.powers.then(function (powers) {
                $scope.availablePowers = powers.filter(function (power) {
                    for (var i = 0; i < $scope.character.powers.powers.length; i++) {
                        if (power.name === $scope.character.powers.powers[i].name) {
                            return false;
                        }
                    }
                    return true;
                });
            });
        }

        updateAvailablePowers();

        $scope.addNewPower = function () {
            $scope.character.experience.addAdvancement(new Advancements.PsychicPowerAdvancement(angular.copy($scope.availablePowers[parseInt($scope.newPower)]), false));
            updateAvailablePowers();
        };

        $scope.$watch("character", function () {
            $scope.characterSkills = Array.from($scope.character.skills);
        });
    }
});