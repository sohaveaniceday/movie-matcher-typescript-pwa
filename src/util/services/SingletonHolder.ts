class SingletonHolder {
  args: any
  singletons: any
  constructor() {
    this.args = {}
    this.singletons = {}
  }

  setArg = (key: any, value: any) => (this.args[key] = value)

  getArgs = () => this.args

  construct = (service: any) => {
    const serviceName: any = service.name

    if (this.singletons[serviceName]) return this.singletons[serviceName]

    this.singletons[serviceName] = new service.constructor(this.args)
    return this.singletons[serviceName]
  }
}

export default new SingletonHolder()
