# Optional encodins

I did som research trying various encoding approaches to get the data into a managable size. The details can probably be found in the history of this repository.

## Layouts

The XML file is a really simple hierarichal representation with lots of duplications. So the first thing was to get the the redundancy down |  To this end I tried a 5NF layout for it's relative simplicity but also a 6NF which, if nothing else, should compress much better than a 5NF layout.

## Size

| Size | Layout | Encoding | Compression |
| ---: | ------ | -------- | ----------- |
| 246K | 6NF    | json     | lzma        |
| 247K | 6NF    | json     | brotli      |
| 249K | 6NF    | proto    | lzma        |
| 251K | 6NF    | avro     | lzma        |
| 259K | 6NF    | msgpack  | lzma        |
| 262K | 6NF    | pson     | lzma        |
| 265K | 6NF    | avro     | brotli      |
| 265K | 6NF    | cbor     | lzma        |
| 265K | 6NF    | proto    | brotli      |
| 266K | 6NF    | msgpack  | brotli      |
| 270K | 6NF    | pson     | brotli      |
| 273K | 6NF    | cbor     | brotli      |
| 403K | 6NF    | bson     | lzma        |
| 432K | 6NF    | bson     | brotli      |
| 433K | 5NF    | avro     | lzma        |
| 440K | 5NF    | proto    | lzma        |
| 479K | 5NF    | avro     | brotli      |
| 481K | 5NF    | pson     | lzma        |
| 484K | 5NF    | json     | lzma        |
| 495K | 5NF    | proto    | brotli      |
| 508K | 5NF    | msgpack  | lzma        |
| 533K | 5NF    | json     | brotli      |
| 533K | 5NF    | pson     | brotli      |
| 554K | 5NF    | cbor     | lzma        |
| 601K | 5NF    | msgpack  | brotli      |
| 618K | Nested | xml      | brotli      |
| 628K | Nested | xml      | lzma        |
| 656K | 5NF    | cbor     | brotli      |
| 685K | 5NF    | bson     | lzma        |
| 688K | 6NF    | avro     | snappy      |
| 690K | 6NF    | proto    | snappy      |
| 777K | 6NF    | msgpack  | snappy      |
| 802K | 6NF    | cbor     | snappy      |
| 804K | 6NF    | pson     | snappy      |
| 841K | 6NF    | proto    | lzf         |
| 842K | 6NF    | avro     | lzf         |
| 844K | 5NF    | bson     | brotli      |
| 966K | 6NF    | msgpack  | lzf         |
| 974K | 5NF    | avro     | snappy      |
| 981K | 6NF    | cbor     | lzf         |
| 986K | 6NF    | pson     | lzf         |
| 1.0M | 5NF    | avro     | lzf         |
| 1.0M | 6NF    | json     | lzf         |
| 1.0M | 6NF    | json     | snappy      |
| 1.0M | 5NF    | proto    | lzf         |
| 1.0M | 5NF    | proto    | snappy      |
| 1.2M | 5NF    | pson     | snappy      |
| 1.2M | 5NF    | pson     | lzf         |
| 1.4M | 5NF    | msgpack  | lzf         |
| 1.5M | 5NF    | msgpack  | snappy      |
| 1.6M | 5NF    | json     | snappy      |
| 1.6M | 5NF    | json     | lzf         |
| 1.6M | 5NF    | cbor     | snappy      |
| 1.6M | 6NF    | avro     |             |
| 1.6M | 6NF    | proto    |             |
| 1.7M | 5NF    | cbor     | lzf         |
| 1.9M | 6NF    | msgpack  |             |
| 1.9M | 6NF    | pson     |             |
| 1.9M | 6NF    | cbor     |             |
| 2.2M | 5NF    | bson     | lzf         |
| 2.3M | 5NF    | avro     |             |
| 2.3M | 5NF    | bson     | snappy      |
| 2.5M | 5NF    | proto    |             |
| 2.7M | 6NF    | json     |             |
| 3.5M | Nested | xml      | snappy      |
| 3.6M | 5NF    | pson     |             |
| 3.6M | 6NF    | bson     | snappy      |
| 4.6M | Nested | xml      | lzf         |
| 4.7M | 6NF    | bson     | lzf         |
| 9.8M | 6NF    | bson     |             |
| 9.9M | 5NF    | msgpack  |             |
|  10M | 5NF    | cbor     |             |
|  12M | 5NF    | json     |             |
|  13M | 5NF    | bson     |             |
|  34M | Nested | xml      |             |

## Decoding speed

Time to read entire file into a js-object

| Layout | Encoding | Compression |                Decoding speed                |
| ------ | -------- | ----------- | -------------------------------------------: |
| 6NF    | json     | brotli      | `6,689` ops/sec `±1.72%` (`89` runs sampled) |
| 6NF    | proto    | brotli      | `6,210` ops/sec `±1.71%` (`86` runs sampled) |
| 6NF    | avro     | brotli      | `6,210` ops/sec `±1.92%` (`85` runs sampled) |
| 5NF    | avro     | brotli      | `3,754` ops/sec `±1.48%` (`85` runs sampled) |
| 5NF    | proto    | brotli      | `3,647` ops/sec `±1.57%` (`82` runs sampled) |
| 5NF    | json     | brotli      | `3,435` ops/sec `±1.45%` (`88` runs sampled) |
| 6NF    | proto    |             | `1,210` ops/sec `±2.03%` (`79` runs sampled) |
| 6NF    | avro     |             | `1,207` ops/sec `±2.26%` (`79` runs sampled) |
| 5NF    | proto    |             |   `817` ops/sec `±2.63%` (`75` runs sampled) |
| 6NF    | json     |             |   `774` ops/sec `±2.57%` (`75` runs sampled) |
| 5NF    | json     |             |   `219` ops/sec `±1.62%` (`83` runs sampled) |
| 5NF    | avro     |             |   `922` ops/sec `±2.04%` (`73` runs sampled) |

## Conclusion

The 6NF layout together with brotli compression gets both size and decoding speed managable.
There seems to be no real gains going to a binary format though.

Since bortli is natively supported in browsers it should be feasible to just encode the entier database as a module and bundle it togehter with the ui.
