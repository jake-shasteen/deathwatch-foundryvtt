const systemName = "deathwatch";
Hooks.once("init", function init() {
  console.log(`${systemName} | initializing system`);
  CONFIG.Item.documentClass = class SystemItemDocument extends Item {};
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(
    systemName,
    class SystemItemSheet extends ItemSheet {
      static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: [systemName, "sheet", "item"],
          template: `systems/${systemName}/templates/item-sheet.html`,
        });
      }
    },
    { makeDefault: true }
  );

  CONFIG.Actor.documentClass = class SystemActorDocument extends Actor {
    prepareData() {
      super.prepareData();
    }

    prepareBaseData() {}

    prepareDerivedData() {}
  };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(
    systemName,
    class SystemActorSheet extends ActorSheet {
      static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: [systemName, "sheet", "actor"],
          template: `systems/${systemName}/templates/actor-sheet.html`,
        });
      }
    },
    { makeDefault: true }
  );

  CONFIG.Token.documentClass = class SystemTokenDocument extends (
    TokenDocument
  ) {};
  CONFIG.Token.objectClass = class SystemTokenObject extends Token {};

  Handlebars.registerHelper(
    "each_when",
    function (list, propName, value, options) {
      const result = list.filter(
        (systemItemDocument: Record<string, any>) =>
          systemItemDocument[propName] == value
      ).map((systemItemDocument: Record<string, any>) =>
        options.fn({ item: systemItemDocument })
      );

      return result.length > 0
        ? result.reduce(
            (resultHtml: string, currHtml: string) => (resultHtml += currHtml),
            ""
          )
        : options.inverse();
    }
  );

  console.log(`${systemName} | finished initialization`);
});
