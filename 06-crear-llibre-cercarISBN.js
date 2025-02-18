const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();

class MyTest extends BaseTest {
    async test() {
        try {
            var site = process.env.URLLOGIN;
            await this.driver.get(site + "/admin/login");

            // Buscar los campos de usuario y contraseña
            let inputUserName = await this.driver.wait(until.elementLocated(By.id("id_username")), 10000);
            let inputUserPassword = await this.driver.wait(until.elementLocated(By.id("id_password")), 10000);

            inputUserName.sendKeys(process.env.USUARI);
            inputUserPassword.sendKeys(process.env.CONTRASENYA);

            // Clic en el botón de login
            let submitButton = await this.driver.wait(until.elementLocated(By.css("input[value='Iniciar sessió']")), 10000);
            submitButton.click();

            // Verificar login
            let logoutButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 10000);
            var currentLogoutText = await logoutButton.getText();
            var expectedText = "FINALITZAR SESSIÓ";

            if (currentLogoutText !== expectedText) {
                throw new Error(`ERROR: Logout Button incorrecto. Encontrado: "${currentLogoutText}", Esperado: "${expectedText}". No se ha conseguido iniciar sesión`);
            }

            console.log("Login verificado correctamente.");

            // Crear un libro
            console.log("Accediendo a la página de creación de libros...");
            await this.driver.findElement(By.xpath("//a[@href='/admin/biblio/llibre/add/']")).click();

            let inputTitle = await this.driver.wait(until.elementLocated(By.name("titol")), 5000);
            inputTitle.sendKeys(process.env.BOOKTITLE);

            // Introducir ISBN manualmente
            let inputISBN = await this.driver.wait(until.elementLocated(By.name("ISBN")), 5000);
            inputISBN.sendKeys('8888888888');

            await inputISBN.click();

            // Guardar libro
            let saveButton = await this.driver.wait(until.elementLocated(By.xpath("//input[@value='Desar']")), 5000);
            saveButton.click();

            // Verificar que se ha creado el libro
            let successMessage = await this.driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'success')]")), 10000);
            if (!successMessage) {
                throw new Error("ERROR: No se encontró mensaje de éxito. Puede que la creación haya fallado.");
            }
            console.log("Libro creado con éxito.");

            // Buscar por ISBN
            console.log("Buscando libro por ISBN...");
            const searchBar = await this.driver.findElement(By.id("searchbar"));
            await searchBar.sendKeys("8888888888");
            await this.driver.findElement(By.css('input[type="submit"][value="Cerca"]')).click();

            // Verificar que el libro aparece en los resultados de búsqueda
            let searchResult = await this.driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '8888888888')]`)), 10000);
            if (!searchResult) {
                throw new Error("ERROR: No se encontró el libro con el ISBN proporcionado.");
            }

            console.log("Libro con ISBN encontrado correctamente.");
            console.log("TEST OK");
        } catch (error) {
            console.error("TEST FALLIDO: " + error.message);
            assert.fail(error.message);
        }
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();