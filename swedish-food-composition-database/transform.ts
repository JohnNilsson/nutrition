switch (process.argv[2]) {

  case "sql":
    const { default: XmlToSQLTransform } = await import('./src/XmlToSQLTransform.js');
    process.stdin
    .pipe(new XmlToSQLTransform())
    .pipe(process.stdout);
    break;

  case "6NF.json":
    const { default: XmlTo6NFTransform } = await import('./src/XmlTo6NFTransform.js');
    const { default: JSONStream } = await import('JSONStream');
    process.stdin
    .pipe(new XmlTo6NFTransform())
    .pipe(JSONStream.stringify(false))
    .pipe(process.stdout);
    break;

  default:
    console.log("Usage: node transform.js <algorithm>");

}