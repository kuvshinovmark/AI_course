<script>
  export let files
  export let availableExtensions = ['jpg', 'jpeg', 'png']
  let filenameLengthThreshold = 25

  function overrideDefault(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function addFile(event) {
    files = event.dataTransfer.files;
    changeLabel();
  }

  function changeLabel() {
    let label_text = document.getElementById('input-label');
    if (files) {
      let shortenedFilename = getShortenedFilename(files[0])
      if (!isElemInArray(availableExtensions, getExtension(files[0]))) {
        label_text.innerText = shortenedFilename + ' - формат не поддерживается!';
        label_text.style.color="#FF0033";

      } else {
        label_text.innerText = shortenedFilename + ' - загружен';
        label_text.style.color="#313131";
      }
    } else {
      label_text.innerText = 'Ошибка при загрузке файла!';
      label_text.style.color="#FF0033";
    }
  }

  function getShortenedFilename(file) {
    let shortenedFilename = file.name
    if (shortenedFilename.length > filenameLengthThreshold) {
      shortenedFilename = shortenedFilename.slice(0, filenameLengthThreshold) + '...'
    }
    return shortenedFilename
  }

  function calculateStyle() {
    let style = `width: 100%; height: 300px; border: 2px #282828 dashed;`
    return style
  }

  function isElemInArray(array, elem) {
    return array.indexOf(elem) != -1
  }

  function getExtension(file) {
    return file.name.split('.').pop()
  }
</script>

  <div class="input-zone" style="{calculateStyle()}">
    <input type="file" id="file-input" name="file-input" bind:files on:change={changeLabel}>
    <label for="file-input" id="file-label"
           on:dragover={(e) => {overrideDefault(e); document.getElementById('file-label').style.filter="blur(1px)"}}
           on:dragenter={overrideDefault}
           on:dragleave={(e) => {overrideDefault(e); document.getElementById('file-label').style.filter="blur(0)"}}
           on:drop={(e) => {overrideDefault(e); addFile(e); document.getElementById('file-label').style.filter="blur(0)"}}
    >
      <p id="input-label">Загрузите файлы (jpg, png)</p>
    </label>
  </div>

<style>
  .input-zone {
    background-color: #FEFEFE;
    margin: 0;
  }

  input {
    display: none;
  }

  label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  label:hover {
    cursor: pointer;
  }

  label p {
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    font-size: 20px;
    color: #313131;
  }
</style>
