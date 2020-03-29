# district-data-germany

> WARNING!! MultiPolygon support is still very buggy! Complex results may be wrong!

## Functions 

### Districts.init() [ASYNC]

load the dataset into memory.

### Districts.getDistrictData()

Return the complete dataset. This is mostly used interally.

### Districts.getDistrictByPoint(lat, lon)

Return the district data that contains the given position or `null` if the point is not in germany.

#### Example

```js
const Districts = require('district-data-germany');

const districts = new Districts();
await districts.init();

const district =.districts.getDistrictByPoint(49.4767969145344, 10.9835363685);
console.log(district);
```

Output:
```
{
  name_2: 'Fürth',
  name_0: 'Germany',
  name_1: 'Bayern',
  cca_2: '09563',
  engtype_2: 'District',
  geo_point_2d: [ 49.4914188335, 10.9654822077 ],
  hasc_2: 'DE.BY.FL',
  id_2: 77,
  type_2: 'Kreisfreie Stadt',
  id_0: 86,
  id_1: 2,
  iso: 'DEU',
  geo_shape: { type: 'Polygon', coordinates: [ [Array] ] },
  ccn_2: 0
}
```

## License

## Software

[AGPL-3.0-or-later](https://opensource.org/licenses/AGPL-3.0)

Copyright (c) 2020 by Alexander Wunschik <dev@wunschik.net>

## Data

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) by opendatasoft.com