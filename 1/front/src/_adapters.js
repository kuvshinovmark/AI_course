import axios from "axios";

class ApiAdapter {
  permittedExtensions = ['jpg', 'png', 'jpeg']

  url
  apiId
  secret

  constructor(apiName) {
    this.url = import.meta.env[`VITE_${apiName}_URL`]
    this.apiId = import.meta.env[`VITE_${apiName}_API_ID`]
    this.secret = import.meta.env[`VITE_${apiName}_SECRET`]
  }

  findFacesInFile(file) {

    // console.log(file);

    if (!this.fileExtensionPermission(file)) {
      alert('Расширение файла не поддерживается')
      return
    }
    
    const data = this.prepareData(file)
    
    const headers = this.prepareHeaders()
    
    return axios.post(this.url, data, { headers })
        .then(response => this.processResponse(response))
        .catch(error => this.processError(error))
  }

  fileExtensionPermission(file) {
    const fileExtension = file.name.split('.').pop()
    return this.permittedExtensions.includes(fileExtension)
  }

  prepareData(file) {
    return {}
  }

  prepareHeaders() {
    return {}
  }

  processResponse(response) {
    return {}
  }

  processError(error) {
    alert('Ошибка!')
    console.log(error)
    return {}
  }
}

export class EveryPixelApi extends ApiAdapter {
  constructor() {
    const apiName = 'EVERY_PIXEL'
    super(apiName)
  }

  prepareData(file) {
    let form_data = new FormData()
    form_data.append("data", file)
    return form_data
  }

  prepareHeaders() {
    return { 'Authorization': 'Basic ' + btoa(`${this.apiId}:${this.secret}`) }
  }

  processResponse(response) {
    const faces = response.data.faces.map(face => {
      const coords = face.bbox
      const width = coords[2] - coords[0]
      const height = coords[3] - coords[1]
      return {left: coords[0], top: coords[1], width, height}
    })

    return faces
  }
}

export class FacePlusPlusApi extends ApiAdapter {
  constructor() {
    const apiName = 'FACE_PLUS_PLUS'
    super(apiName);
  }


  prepareData(file) {
    let form_data = new FormData();
    form_data.append("api_key", this.apiId);
    form_data.append("api_secret", this.secret);
    form_data.append("image_file", file);
    return form_data
  }

  processResponse(response) {
    const faces = response.data.faces.map(face => face.face_rectangle)
    return faces
  }
}

export class PresentIdApi extends ApiAdapter {
  constructor() {
    const apiName = 'PRESENT_ID'
    super(apiName)
    this.apiHost = import.meta.env[`VITE_PRESENT_ID_API_HOST`]
  }

  prepareHeaders() {
    return {
      'X-RapidAPI-Key': this.apiId,
      'X-RapidAPI-Host': this.apiHost
    }
  }

  prepareData(file) {


    let form_data = new FormData();
    form_data.append("photo", file);
    return form_data
  }

  processResponse(response) {
    if (!response.data.data) return []
    const faces = response.data.data.map(face => {
      const coords = Array(face.rectangle.lb, face.rectangle.lt, face.rectangle.rb, face.rectangle.rt)
      const x_coords = coords.map(coord => coord.x)
      const y_coords = coords.map(coord => coord.y)
      const left = Math.min(...x_coords)
      const right = Math.max(...x_coords)
      const top = Math.min(...y_coords)
      const bottom = Math.max(...y_coords)
      const width = right - left
      const height = bottom - top
      return { left, top, width, height }
    })
    return faces
  }
}