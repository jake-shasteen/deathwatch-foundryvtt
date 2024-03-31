const systemName = "deathwatch";

Hooks.on("preCreateItem", function preCreateItem(item: Item) {
  if (item.isEmbedded && item.parent?.documentName === "Actor") {
    if (item.type === "chapter" || item.type === "specialization") {
      if (item.parent.type === "player character") {
        for (const [, actorItem] of item.parent.items.entries()) {
          if (
            actorItem != null &&
            actorItem.id != null &&
            actorItem.type === item.type &&
            actorItem.id !== item.id
          ) {
            actorItem.delete();
          }
        }
      }
    }
  }
});

class SystemItemDocument extends Item {}

Hooks.once("init", function init() {
  console.log(`${systemName} | initializing system`);
  CONFIG.Item.documentClass = SystemItemDocument;
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
    { makeDefault: true },
  );

  CONFIG.Actor.documentClass = class SystemActorDocument extends Actor {
    chapter?: SystemItemDocument;
    specialization?: SystemItemDocument;

    constructor(...args: ConstructorParameters<typeof Actor>) {
      super(...args);
    }

    prepareDerivedData() {
      const actorDocument = this;
      if (actorDocument.type !== "player character") return;
      const chapter = actorDocument.items.find(
        ({ type }) => type === "chapter",
      );
      const specialization = actorDocument.items.find(
        ({ type }) => type === "specialization",
      );
      actorDocument.chapter = chapter;
      actorDocument.specialization = specialization;
    }
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

      getData() {
        const data = super.getData();
        return data;
      }

      activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);

        html.find(".item-delete").click((event) => {
          const li = $(event.currentTarget).parents(".item");
          const item = this.actor.items.find(
            ({ id }) => id == li.data("itemId"),
          );
          item?.delete();
        });
      }
    },
    { makeDefault: true },
  );

  CONFIG.Token.documentClass = class SystemTokenDocument extends (
    TokenDocument
  ) {};
  CONFIG.Token.objectClass = class SystemTokenObject extends Token {};

  Handlebars.registerHelper(
    "each_when",
    function (list, propName, value, options) {
      const result = list
        .filter(
          (systemItemDocument: Record<string, any>) =>
            systemItemDocument[propName] == value,
        )
        .map((systemItemDocument: Record<string, any>) =>
          options.fn({ item: systemItemDocument }),
        );

      return result.length > 0
        ? result.reduce(
            (resultHtml: string, currHtml: string) => (resultHtml += currHtml),
            "",
          )
        : options.inverse();
    },
  );

  Handlebars.registerHelper(
    "ifEq",
    function (item, propName, testValue, options) {
      return item[propName] == testValue ? options.fn({ item }) : null;
    },
  );

  Handlebars.registerHelper("capitalize", function (word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  console.log(`${systemName} | finished initialization`);
});
