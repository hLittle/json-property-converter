import {
  camel as ccCamel,
  snake as ccSnake,
} from 'change-case'
const isPlainObject = value => typeof value === 'object' && value !== null && Object.prototype.toString.call(value) === '[object Object]'

const transform = (data, fn, overwrite = false) => {
  if (!Array.isArray(data) && !isPlainObject(data) && !isFormData(data) && !isURLSearchParams(data)) {
    return data
  }

  const prototype = Object.getPrototypeOf(data)
  const store = overwrite ? data : prototype ? new prototype.constructor : Object.create(null)
  for (const [key, value] of prototype && prototype.entries ? prototype.entries.call(data) : Object.entries(data)) {
    if (prototype && prototype.append) {
      prototype.append.call(store, key.replace(/[^[\]]+/g, k => fn(k)), transform(value, fn))
    } else if (key !== '__proto__') {
      store[fn(key)] = transform(value, fn)
    }
  }
  return store
}

export const createTransform = fn => (data, overwrite = false) => transform(data, fn, overwrite)

export const snake = createTransform(ccSnake)
export const camel = createTransform(ccCamel)

export default transform