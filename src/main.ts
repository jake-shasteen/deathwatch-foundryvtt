const systemName = "deathwatch";
Hooks.once("init", function init() {
  console.log(`${systemName} | initializing system`);
  CONFIG.Item.documentClass = class SystemItemDocument extends Item {};
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(systemName, class SystemItemSheet extends ItemSheet {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: [systemName, "sheet", "actor"],
        template: `systems/${systemName}/templates/item-sheet.html`
      });
    }
  }, { makeDefault: true });
  
  CONFIG.Actor.documentClass = class SystemActorDocument extends Actor {};
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(systemName, class SystemActorSheet extends ActorSheet {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: [],
        template: `systems/${systemName}/templates/actor-sheet.html`
      });
    }
  }, { makeDefault: true });

  CONFIG.Token.documentClass = class SystemTokenDocument extends TokenDocument {};
  CONFIG.Token.objectClass = class SystemTokenObject extends Token {};

  console.log(`${systemName} | finished initialization`);
});
