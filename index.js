#!/usr/bin/env node

if (process.argv.length != 4) {
  console.log(`Usage:
    streaming-qhp-validator providers ./provider.json
    streaming-qhp-validator plans ./plan.json`)
  return
}

const [,,type, path] = process.argv
if (type != 'providers' && type != 'plans') {
  console.log('Unrecognized type: Must be either providers or plans')
  return
}

const fs = require('fs')
const Validator = require('ajv')
const JSONStream = require('JSONStream')

const schema = require(`./${type}_schema.json`)
const validator = new Validator()
validator.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
const validate = validator.compile(schema)

let count = 0
let errors = {}

const stream = JSONStream.parse('*')
stream.on('data', function(value) {
  count++
  const valid = validate(value)
  if (valid) {
    process.stdout.write('.')
  } else {
    process.stdout.write('F')
    errors[count] = validate.errors
  }
})

stream.on('error', function(err) {
  console.log('The validator could not continue because the JSON file is invalid:')
  console.log(err)
})

stream.on('end', function() {
  console.log()

  if (Object.keys(errors).length) {
    console.error('The validator detected the following errors:')
    console.error(errors)
  } else {
    console.log(`All ${count} ${type} valid.`)
  }
})

fs.createReadStream(path).pipe(stream)
