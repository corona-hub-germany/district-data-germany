const fs = require('fs-extra');
const path = require('path');
const geolib = require('geolib');

const DATA_FILE = path.join(__dirname, '..', 'data', 'landkreise-in-germany.json');
/*
[
  {
    "datasetid": "landkreise-in-germany",
    "recordid": "ce5bf71445335da5147d587edc757056d48cfcc5",
    "fields": {
      "name_2": "Freiburg im Breisgau",
      "name_0": "Germany",
      "name_1": "Baden-Württemberg",
      "cca_2": "08311",
      "engtype_2": "District",
      "geo_point_2d": [
        47.9925229956,
        7.81807596197
      ],
      "hasc_2": "DE.BW.FB",
      "id_2": 12,
      "type_2": "Stadtkreis",
      "id_0": 86,
      "id_1": 1,
      "iso": "DEU",
      "geo_shape": {
        "type": "Polygon",
        "coordinates": [
          []
        ]
      },
      "ccn_2": 0
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        12.0740705739,
        50.748459553800004
      ]
    },
    "record_timestamp": "2017-08-09T12:44:47.884+02:00"
  }
]
*/

class Districts {

	_ensureData() {
		if (!this.districts) {
			throw new Error(`Please call Districts.init() before accessing the data!`);
		}
	}

	_geoShapeToPoints(geoShape) {
		const type = geoShape.type ? geoShape.type.toUpperCase() : 'POLYGON';
		if (type === 'POLYGON') {
			return geoShape.coordinates[0].map(p => {
				return {
					latitude: p[1],
					longitude: p[0]
				}
			});
		} else if (type === 'MULTIPOLYGON') {
			function mapPolygon(polygon) {
				if (polygon[0].length > 2) {
					return mapPolygon(polygon[0]);
				} else {
					return polygon.map(p => {
						return {
							latitude: p[1],
							longitude: p[0]
						}
					});
				}
			}
			return geoShape.coordinates.map(polygon => {
				return mapPolygon(polygon);
			});
		}
	}

	_pointInPolygons(point, polygons) {
		if (polygons[0].length > 2) {
			for (let polygon of polygons) {
				const inPolygon = geolib.isPointInPolygon(point, polygon);
				if (inPolygon) {
					return true;
				}
			};
		} else {
			return geolib.isPointInPolygon(point, polygons);
		}
	}

	async init() {
		// only load once
		if (this.districts) return;

		if (!fs.existsSync(DATA_FILE)) {
			throw new Error(`data file "${DATA_FILE}" not found`);
		}
		try {
			var districts = await fs.readJSON(DATA_FILE);
			districts = districts
				.map(district => district.fields)
				.map(district => {
					district.centerPoint = {
						latitude: district.geo_point_2d[0],
						longitude:  district.geo_point_2d[1],
					}
					district.geo_shape.coordinates = this._geoShapeToPoints(district.geo_shape);
					return district;
				});
			this.districts = districts;
		} catch(err) {
			throw new Error(`Error loading districts from file "DATA_FILE": ${err}`);
		}
	}

	getDistrictData() {
		this._ensureData();
		return this.districts;
	}

	getDistrictByPoint(lat, lon) {
		this._ensureData();
		const point = {
			latitude: lat,
			longitude: lon,
		};

		/* First we create a sorted lookup-array with the
		 * distances to the district-center and a cca_2 a s a key.
		 * This improves the search-speed. */
		const districtsInfo = this.districts
			.map(d => {
				return {
					distanceToPoint: geolib.getPreciseDistance(d.centerPoint, point, 4),
					cca_2: d.cca_2
				}
			})
			.sort((a, b) => a.distanceToPoint - b.distanceToPoint);

		/* check if the point is inside the district */
		var resultDistricts = []
		for (let i=0; i<=5; i++) {
			const districtInfo = districtsInfo[i];
			const district = this.districts.find(d => d.cca_2 === districtInfo.cca_2);

			const isInDistrict = this._pointInPolygons(point, district.geo_shape.coordinates);
			if (isInDistrict) {
				resultDistricts.push(district);
			}
		}

		if (resultDistricts.length === 1) {
			return resultDistricts[0]
		} else if (resultDistricts.length > 1) {
			const msg = `Multible districts found. The MultiPolygon implementation must be improved: ${resultDistricts.map(d => `"${d.name_2}"`).join(', ')}. Using the first on!`;
			console.warn(msg);
			//TODO: Is some special cases we return the wrong (surrounding) district here!
			//throw new Error(msg);
			return resultDistricts[0];
		} else {
			return null;
		}
	}

}

module.exports = Districts
