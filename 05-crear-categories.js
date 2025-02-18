// Cargamos las librerías
const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");

// Cargar variables de entorno
require("dotenv").config();
console.log(process.env);

class MyTest extends BaseTest {
  async test() {
    try {
      // Login test
      var site = process.env.URLLOGIN;
      await this.driver.get(site + "/admin/login");

      // Buscar login box
      let inputUserName = await this.driver.wait(
        until.elementLocated(By.id("id_username")),
        10000
      );
      let inputUserPassword = await this.driver.wait(
        until.elementLocated(By.id("id_password")),
        10000
      );

      // Introducir usuario y contraseña
      inputUserName.sendKeys(process.env.USUARI);
      inputUserPassword.sendKeys(process.env.CONTRASENYA);

      // Botón de envío - click()
      let submitButton = await this.driver.wait(
        until.elementLocated(By.css("input[value='Iniciar sessió']")),
        10000
      );
      submitButton.click();

      // Verificar login
      let logoutButton = await this.driver.wait(
        until.elementLocated(By.xpath('//button[@type="submit"]')),
        10000
      );
      var currentLogoutText = await logoutButton.getText();
      var expectedText = "FINALITZAR SESSIÓ";

      if (currentLogoutText !== expectedText) {
        throw new Error(
          `Login fallido.\n\tTEXT ENCONTRADO: "${currentLogoutText}"\n\tTEXT ESPERADO: "${expectedText}"`
        );
      }

      console.log("Login verificado correctamente.");

      // Crear categoría principal
      await this.driver
        .findElement(By.xpath("//a[@href='/admin/biblio/categoria/add/']"))
        .click();
      await this.driver.findElement(By.name("nom")).sendKeys("Juegos de Mesa");
      await this.driver
        .findElement(By.xpath("//input[@value='Desar']"))
        .click();

      // Verificar que la categoría se ha creado
      let successMessage = await this.driver.wait(
        until.elementLocated(By.xpath("//li[contains(@class, 'success')]")),
        10000
      );
      if (!successMessage) {
        throw new Error(
          "ERROR: No se encontró mensaje de éxito al crear la categoría."
        );
      }

      // Crear subcategorías dentro de "Juegos de Mesa"
      const subcategories = ["Estrategia", "Rol", "Cartas", "Cartas"];

      for (const category of subcategories) {
        await this.driver
          .findElement(By.xpath("//a[@href='/admin/biblio/categoria/add/']"))
          .click();
        await this.driver.findElement(By.name("nom")).sendKeys(category);
        await this.driver
          .findElement(
            By.xpath(`//select[@name='parent']/option[text()='Juegos de Mesa']`)
          )
          .click();
        await this.driver
          .findElement(By.xpath("//input[@value='Desar']"))
          .click();

        // Verificar que la subcategoría se ha creado
        let subcategorySuccess = await this.driver.wait(
          until.elementLocated(By.xpath("//li[contains(@class, 'success')]")),
          10000
        );
        if (!subcategorySuccess) {
          throw new Error(
            `ERROR: No se encontró mensaje de éxito al crear la subcategoría "${category}".`
          );
        }
      }

      console.log("Todas las categorías y subcategorías creadas con éxito.");
      console.log("TEST OK");
    } catch (error) {
      console.error("TEST FALLIDO: " + error.message);
      assert.fail(error.message);
    }
  }
}

// Ejecutamos el test
(async function test_example() {
  const test = new MyTest();
  await test.run();
  console.log("END");
})();