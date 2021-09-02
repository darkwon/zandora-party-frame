import constants from "./constants.js";

const unitFrameDefault = {top: 400, left: 120};

export default function registerSettings() {
  game.settings.register(constants.moduleName, "unit-frame-box-position", {
    scope: "client",
    config: false,
    default: unitFrameDefault,
  });

   game.settings.register(constants.moduleName, "skin", {
    name: "ZandoraPUF.Settings.skin.name",
    hint: "ZandoraPUF.Settings.skin.hint",
    scope: "client",
    config: true,
    default: 'default',
    type: String,
    choices: {
      "default": "ZandoraPUF.Settings.skin.default",
      "pill": "ZandoraPUF.Settings.skin.pill",
      "thin": "ZandoraPUF.Settings.skin.thin"
    },
    onChange: value => {
      if (ui.unitFrames?.rendered) {
        ui.unitFrames.element.removeClass('default pill thin').addClass(value);
      }
    }
  });

  game.settings.register(constants.moduleName, "filter", {
    name: "ZandoraPUF.Settings.filter.name",
    hint: "ZandoraPUF.Settings.filter.hint",
    scope: "client",
    config: true,
    default: 'none',
    type: String,
    choices: {
      "none": "ZandoraPUF.Settings.filter.none",
      "damped": "ZandoraPUF.Settings.filter.damped",
      "grayscale": "ZandoraPUF.Settings.filter.grayscale",
      "sepia": "ZandoraPUF.Settings.filter.sepia"
    },
    onChange: value => {
      if (ui.unitFrames?.rendered) {
        ui.unitFrames.element.removeClass('none damped grayscale sepia').addClass(value);
      }
    }
  });

  game.settings.register(constants.moduleName, "showResourceValues", {
    name: "ZandoraPUF.Settings.showResourceValues.name",
    hint: "ZandoraPUF.Settings.showResourceValues.hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => ui.unitFrames?.render()
  });

  game.settings.register(constants.moduleName, "resetUnitFrames", {
    name: "ZandoraPUF.Settings.resetUnitFrames.name",
    hint: "ZandoraPUF.Settings.resetUnitFrames.hint",
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