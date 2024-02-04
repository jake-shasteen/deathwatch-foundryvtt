function helloWorld() {
  console.log("hello, world");
}
Hooks.once("init", helloWorld);
Hooks.once("setup", helloWorld);
Hooks.once("ready", helloWorld);
