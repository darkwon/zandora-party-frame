import constants from "../constants.js";
import RepositionableApplication from "./RepositionableApplication.js";

export default class UnitFramesBox extends RepositionableApplication {
  static app;
  tokenColors = {};
  positionSetting = 'unit-frame-box-position';

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "unit-frame-box",
      template: `${constants.modulePath}/templates/hud/unit-frame-box.html`,
      popOut: false
    });
  }

  /** @override */
  getData(options = {}) {
    options = super.getData(options);
    options.tokens = this.getTokens();
    options.frames = this.prepareTokens(options.tokens);
    options.skin = game.settings.get(constants.moduleName, 'skin');
    options.displayValues = game.settings.get(constants.moduleName, 'showResourceValues');

    return options;
  }

  prepareTokens(tokens) {
    let frames = [];
    for (let [id, t] of tokens) {
      frames.push({
        id: id,
        name: t.name,
        img: t.actor.img,
        level: t.actor.data.data.details.level,
        primary: this.getPrimary(t.document),
        secondary: this.getSecondary(t.document),
        disposition: this.isFriendly(t.document)
      })
    }

    return frames;
  }

  getPrimary(token) {
    return this.getAttribute(token, 'bar1');
  }

  getSecondary(token) {
    return this.getAttribute(token, 'bar2');
  }

  getAttribute(token, bar) {
    let barData = token.getBarAttribute(bar);
    if (!barData) return {
      percent: 0,
      value: 0,
      max: 0,
    };

    let percent = Math.round((barData.value * 100) / barData.max);

    percent = Math.min(100, Math.max(0, percent));
    return {
      percent: percent,
      value: barData.value,
      max: barData.max,
    }
  }

  getTokens() {
    const tokens = new Map();

    // first linked character
    if (game.user.character) {
      let linked = canvas.tokens.placeables.find(t => t.actor.id === game.user.character.id);
      if (linked) {
        tokens.set(linked.id, linked);
      }
    }
    // then all owned, sorted alphabetically
    canvas.tokens.placeables.filter(t => t.owner && this.canSeeBars(t) && this.isFriendly(t)).sort(this._sortNames).forEach(t => tokens.set(t.id, t));
    // then rest, sorted alphabetically
    canvas.tokens.placeables.filter(t => this.canSeeBars(t) && this.isFriendly(t)).sort(this._sortNames).forEach(t => tokens.set(t.id, t));

    return tokens;
  }

  _sortNames(a, b) {
    return a.name.localeCompare(b.name);
  }

  canSeeBars(token) {
    switch (token.data.displayBars) {
      case CONST.TOKEN_DISPLAY_MODES.ALWAYS:
      case CONST.TOKEN_DISPLAY_MODES.HOVER:
        return true;
      case CONST.TOKEN_DISPLAY_MODES.CONTROL:
      case CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER:
      case CONST.TOKEN_DISPLAY_MODES.OWNER:
	  return token.owner;
      default:
        return false;
    }
  }

  isFriendly(token){
    switch (token.data.disposition){
      case CONST.TOKEN_DISPOSITIONS.FRIENDLY:
        return true;
      default:
        return false;
    }
  }

  static init() {
    const instance = new this();
    ui.unitFrames = instance;
    instance.render(true);
  }


  activateListeners(html) {
    super.activateListeners(html);

    html.on('click', '.unit-frame', this._handleFrameClick);
    html.on('contextmenu', '.unit-frame', this._handleFrameClick);
  }

  _handleFrameClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.originalEvent.detail < 2) {
      switch (event.originalEvent.button) {
        case 2:
          UnitFramesBox._onRightClick(event);
          break;
        case 0:
        default:
          UnitFramesBox._onClick(event);
      }
    } else {
      UnitFramesBox._onDoubleClick(event);
    }
  }


  static _onClick(event) {
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    const release = !game.keyboard.isDown("Shift");
    token.setTarget(!token.isTargeted, {user: game.user, releaseOthers: release});
  }

  static _onRightClick(event) {
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    if (token.actor?.permission > 0)
      token.actor.sheet.render(true, {token: token});
  }

  static _onDoubleClick(event) {
    UnitFramesBox._onClick(event);
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    const grid = canvas.grid.size;
    const x = token.data.x + grid;
    const y = token.data.y + Math.round(grid / 2);
    canvas.animatePan({x: x, y: y, scale: 1});
  }

  updateFrame(token) {
    let id = token.data?._id || token._id;
    token = canvas.tokens.get(id);
    const _this = this;

    this.element.find(`#unit-frame-${id}`).each(function () {
      if (!token) return $(this).remove();

      let primary = _this.getPrimary(token);
      let secondary = _this.getSecondary(token);
      $(this).find('.primary .bar').animate({'width': primary.percent + "%"});
      $(this).find('.secondary .bar').animate({'width': secondary.percent + "%"});

      let displayValues = game.settings.get(constants.moduleName, 'showResourceValues');
      let name = token.name;
      if (displayValues) {
        name += `<div class="primaryValue">${primary.value}/${primary.max}</div>`;
        $(this).find('.secondaryValue').html(`${secondary.value}/${secondary.max}`);
      }

      $(this).find('.name').html(name);
    });
  }

  removeFrame(token) {
    let id = token._id;

    this.element.find(`#unit-frame-${id}`).remove();
  }

  setTargetFrame(token, isTargeted) {
    let id = token.data?._id || token._id;

    let frame = this.element.find(`#unit-frame-${id}`);
    if (isTargeted) {
      $(frame).addClass('target');

      // Sync animations
      let frames = this.element.find('.target');
      frames.removeClass('target');
      frames.each(function () {
        $(this).height();
      });
      frames.addClass('target');
      // End sync animations
    } else {
      $(frame).removeClass('target');
    }
  }
}