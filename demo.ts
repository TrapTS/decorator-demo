function Param(hello: string) {
  return (target: any, key: string, index: number) => {
    var metadataKey = `__required_${key}_parameters_${hello}`
    console.log('----->', metadataKey)
    if (Array.isArray(target[metadataKey])) {
      target[metadataKey].push(index)
    } else {
      target[metadataKey] = [index]
    }
    console.log('---tt-->', target[metadataKey])
  }
}
function validate(world: Object) {
  return (target, key, descriptor) => {
    var originalMethod = descriptor.value
    descriptor.value = function(...args: any[]) {
      const keys = Object.keys(world)
      keys.map(item => {
        var metadataKey = `__required_${key}_parameters_${item}`
        console.log('--target--->', metadataKey)
        var indices = target[metadataKey]
        console.log('---xxx-->', indices)
      })
      for (var i = 0; i < args.length; i++) {
        if (arguments[i] === undefined) {
          throw 'missing required parameter'
        }
      }
      var result = originalMethod.apply(this, args)
      return result
    }
    return descriptor
  }
}

class Calculator {
  @validate({
    a: 'string',
    b: 'string'
  })
  add(@Param('a') a: number, @Param('b') b: number) {
    return a + b
  }
  @validate({
    c: 'string',
    d: 'string'
  })
  haha(@Param('c') c: number, @Param('d') d: number) {
    return c + d
  }
}
const c = new Calculator()
console.log(`result is: ${c.add(2, 3)}`) // result is: 5
console.log(`result is: ${c.haha(5, 7)}`)
