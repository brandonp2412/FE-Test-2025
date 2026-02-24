describe("Horse Management App CRU E2E Tests", () => {
  const initialHorse = {
    name: "Thunderdash",
    profile: {
      favouriteFood: "Carrots",
      physical: {
        height: 180,
        weight: 450,
      },
    },
  };

  beforeEach(() => {
    // Clear existing data and seed with a known state before each test
    cy.request("GET", "http://localhost:3016/horse").then((response) => {
      if (response.body.length > 0) {
        // If there's existing data, delete it first (optional, but good for isolation)
        // For simplicity, we'll just put a known horse.
      }
    });
    cy.request("PUT", "http://localhost:3016/horse", initialHorse).then((response) => {
      expect(response.status).to.eq(200);
    });

    cy.visit("/");
    cy.wait(5000); // Initial wait for app to load and fetch data
  });

  it("should display the horse list on initial load (Read)", () => {
    cy.contains("Horse Management").should("be.visible");
    cy.contains("Horse List").should("be.visible");
    cy.contains("Thunderdash").should("be.visible");
  });

  it("should display horse details when a horse name is clicked (Read)", () => {
    cy.get("li:contains(\"Thunderdash\")").find("span").click(); // More robust click
    cy.contains("Thunderdash").should("be.visible"); // Simpler assertion, check for text presence
    cy.contains("Favourite Food: Carrots").should("be.visible");
    cy.contains("Classification: Horse").should("be.visible");
  });

  it("should allow adding a new horse (Create)", () => {
    cy.contains("Add New Horse").click();
    cy.contains("Add New Horse").should("be.visible"); // Form title

    cy.get("label:contains(\"Name\")").next("div").find("input").type("New E2E Horse");
    cy.get("label:contains(\"Favourite Food\")").next("div").find("input").type("E2E Food");
    cy.get("label:contains(\"Height (cm)\")").next("div").find("input").type("155");
    cy.get("label:contains(\"Weight (kg)\")").next("div").find("input").type("380");

    cy.contains("Save").click();

    cy.contains("New E2E Horse").should("be.visible");
  });

  it("should allow editing an existing horse (Update)", () => {
    cy.contains("Thunderdash").click();
    cy.contains("Edit Horse").click();
    cy.contains("Edit Horse").should("be.visible"); // Form title

    cy.get("label:contains(\"Favourite Food\")").next("div").find("input").clear().type("E2E Hay");

    cy.contains("Save").click();

    cy.contains("Thunderdash").click();
    cy.contains("Favourite Food: E2E Hay").should("be.visible");
  });
});
