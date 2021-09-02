import constants from "./constants.js";

const unitFrameDefault = {top: 400, left: 120};

export default function registerSettings() {
  game.settings.register(constants.moduleName, "unit-frame-box-position", {
    scope: "client",
    config: false,
    default: unitFrameDefault,
  });

   game.settings.register(constants.moduleName, "skin", {
    name: "WorkshopPUF.Settings.skin.name",
    hint: "WorkshopPUF.Settings.skin.hint",
    scope: "client",
    config: true,
    default: 'default',
    type: String,
    choices: {
      "default": "WorkshopPUF.Settings.skin.default",
      "pill": "WorkshopPUF.Settings.skin.pill",
      "thin": "WorkshopPUF.Settings.skin.thin"
    },
    onChange: value => {
      if (ui.unitFrames?.rendered) {
        ui.unitFrames.element.removeClass('default pill thin').addClass(value);
      }
    }
  });

  game.settings.register(constants.moduleName, "filter", {
    name: "WorkshopPUF.Settings.filter.name",
    hint: "WorkshopPUF.Settings.filter.hint",
    scope: "client",
    config: true,
    default: 'none',
    type: String,
    choices: {
      "none": "WorkshopPUF.Settings.filter.none",
      "damped": "WorkshopPUF.Settings.filter.damped",
      "grayscale": "WorkshopPUF.Settings.filter.grayscale",
      "sepia": "WorkshopPUF.Settings.filter.sepia"
    },
    onChange: value => {
      if (ui.unitFrames?.rendered) {
        ui.unitFrames.element.removeClass('none damped grayscale sepia').addClass(value);
      }
    }
  });

  game.settings.register(constants.moduleName, "showResourceValues", {
    name: "WorkshopPUF.Settings.showResourceValues.name",
    hint: "WorkshopPUF.Settings.showResourceValues.hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => ui.unitFrames?.render()
  });

  game.settings.register(constants.moduleName, "resetUnitFrames", {
    name: "WorkshopPUF.Settings.resetUnitFrames.name",
    hint: "WorkshopPUF.Settings.resetUnitFrames.hint",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        game.settings.set(constants.moduleName, "unit-frame-box-position", unitFrameDefault);
        game.settings.set(constants.moduleName, "resetUnitFrames", false);
        if (ui.unitFrames?.rendered) ui.unitFrames.render();
      }
    }
  });
}