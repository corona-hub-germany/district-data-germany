const Districts = require('../src/Districts');

var districts;

describe("Districts", () => {
	beforeAll(async () => {
		districts = new Districts();
		await districts.init();
	})

	test("district count", () => {
		const districtsData = districts.getDistrictData();
		expect(districtsData).toBeDefined();
		expect(districtsData.length).toEqual(403);
	});

	test("district[0]", () => {
		const districtsData = districts.getDistrictData();
		const district = districtsData[0];
		expect(district).toBeDefined();
		expect(district.name_2).toEqual('Freiburg im Breisgau');
		expect(district.cca_2).toEqual('08311');
	});

	test("district[123]", () => {
		const districtsData = districts.getDistrictData();
		const district = districtsData[123];
		expect(district).toBeDefined();
		expect(district.name_2).toEqual('Wolfsburg');
		expect(district.cca_2).toEqual('03103');
	});

	test("district[402]", () => {
		const districtsData = districts.getDistrictData();
		const district = districtsData[402];
		expect(district).toBeDefined();
		expect(district.name_2).toEqual('Greiz');
		expect(district.cca_2).toEqual('16076');
	});

	test("getDistrictByPoint [Fürth]", () => {
		const district = districts.getDistrictByPoint(49.4767969145344, 10.983536368541763);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Fürth');
		expect(district.cca_2).toEqual('09563');
	});

	test("getDistrictByPoint [Klinikum der Universität München]", () => {
		const district = districts.getDistrictByPoint(48.1383905, 11.5678228);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('München');
		expect(district.cca_2).toEqual('09162');
	});

	test("getDistrictByPoint [Starnberg clinic]", () => {
		const district = districts.getDistrictByPoint(48.0041401, 11.3114225);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Starnberg');
		expect(district.cca_2).toEqual('09188');
	});

	test("getDistrictByPoint [Klinikum Kempten]", () => {
		const district = districts.getDistrictByPoint(47.732193, 10.3026637);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Kempten (Allgäu)');
		expect(district.cca_2).toEqual('09763');
	});

	test("getDistrictByPoint [Charite Berlin]", () => {
		const district = districts.getDistrictByPoint(52.5251662, 13.3755869);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Berlin');
		expect(district.cca_2).toEqual('11000');
	});

	//TODO: This is a special case where the "Waldecksee" is inside a MultiPolygon of "Rastatt" that is inside the Polygon for "Baden-Baden"
	//TODO: MultiPolygon support is stll very buggy!
	test.skip("getDistrictByPoint [Waldecksee (Rastatt)]", () => {
		const district = districts.getDistrictByPoint(48.7373863, 8.2094367);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Rastatt');
		expect(district.cca_2).toEqual('08216');
	});

	test("getDistrictByPoint [MultiPolygon (Baden-Baden)]", () => {
		const district = districts.getDistrictByPoint(48.75726, 8.1249);
		expect(district).not.toBeNull();
		expect(district.name_2).toEqual('Baden-Baden');
		expect(district.cca_2).toEqual('08211');
	});
	
	test("getDistrictByPoint [Paris]", () => {
		const district = districts.getDistrictByPoint(48.8542708, 2.3474777);
		expect(district).toBeNull();
	});
});