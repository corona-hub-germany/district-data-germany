const fs = require('fs-extra');
const path = require('path');
const geolib = require('geolib');

const DATA_FILE = path.join(__dirname, '..', 'data', 'landkreise-in-germany.json');

async function getDistrictData() {
	if (!fs.existsSync(DATA_FILE)) {
		throw new Error(`data file "${DATA_FILE}" not found`);
	}
	try {
		var districts = await fs.readJSON(DATA_FILE);
		districts = districts.map(district => district.fields);
		return districts
	} catch(err) {
		throw new Error(`Error loading districts from file "DATA_FILE": ${err}`);
	}
}

async function getDistrictByPoint(lat, lon) {
	const districts = await getDistrictData();

	for (let district of districts) {
		const coordinates = district.geo_shape.coordinates[0].map(point => {
			return {
				latitude: point[1],
				longitude: point[0]
			}
		})

		const isInDistrict = geolib.isPointInPolygon({ 
			latitude: lat,
			longitude: lon
		}, coordinates);

		if (isInDistrict) {
			return district
		}
	}
	return null;
}

module.exports = {
	getDistrictData,
	getDistrictByPoint
}
