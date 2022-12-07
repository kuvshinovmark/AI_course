<script>
  import { EveryPixelApi, FacePlusPlusApi, PresentIdApi } from './_adapters'
  import FileInput from './lib/FileInput.svelte'
  import { Pulse } from 'svelte-loading-spinners'

  let files = [];
  let image = {};

  let faceBlocks = [];
  let loading = false;
  let resultsVisible = false;

  let selectedApi = 1
  let apis = [
    { id: 0, color: "red", text: 'Every Pixel Api', api: new EveryPixelApi() },
    { id: 1, color: "#24fc03", text: 'Face Plus Plus Api', api: new FacePlusPlusApi() },
    { id: 2, color: "blue", text: 'Present Id Api', api: new PresentIdApi() }
  ]

  function sendFile() {
    loading = true;
    faceBlocks = [];
    document.getElementById('result-window').scrollIntoView({block: 'end', behavior: 'smooth'});
    apis[0].api.findFacesInFile(files[0]).then(facesFrames => creatingFaces(facesFrames, 0));
    apis[1].api.findFacesInFile(files[0]).then(facesFrames => creatingFaces(facesFrames, 1));
    apis[2].api.findFacesInFile(files[0]).then(facesFrames => creatingFaces(facesFrames, 2));
    showResults();
  }


  function creatingFaces(facesFrames, num) {
    faceBlocks.push({data: facesFrames, text: apis[num].text, color: apis[num].color});
    faceBlocks = faceBlocks;
  }

  function showResults() {
    showImage(files[0])
  }

  function handleClick() {
    if (!files[0]) {
      alert('Сначала выберите файл')
      return
    }
    sendFile();
  }

  function showImage(file) {
    const reader = new FileReader()
    reader.onload = () => {
      image.src = reader.result
    }
    resultsVisible = true
    loading = false
    reader.readAsDataURL(file)
  }

  function calculateFrame(face, color) {
    return `position: absolute; left: ${face.left}px; top: ${face.top}px; width: ${face.width}px; height: ${face.height}px; border: 3px solid ${color};`
  }
</script>
<main>
  <div class="first-view">
    <div style="display: flex; align-items: center">
      <p>Детекция лиц с помощью сервисов</p>
      {#each apis as apiOption}
        <p>&nbsp {apiOption.text}</p>
      {/each}
    </div>
    <FileInput bind:files={files} />
    <button id="submit-button" on:click={handleClick}>Отправить</button>
  </div>
  <div id="result-window">
    {#if loading}
      <Pulse color="#282828"/>
    {:else if resultsVisible}
      <div class="color-text-block">
        {#each faceBlocks as faceBlock}
          <p style="color: {faceBlock.color}; white-space: nowrap;">&nbsp {faceBlock.text} ({faceBlock.data.length})</p>
        {/each}
      </div>
      <div id="result-block">
        
        
        <img id="result-img" bind:this={image} src="" alt="Result" />
        {#each faceBlocks as faceBlock}
          {#each faceBlock.data as face}
            <div style="{calculateFrame(face, faceBlock.color)}">
              <!-- <p style="color: {faceBlock.color};">{faceBlock.text}</p> -->
            </div>  
          {/each}
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .first-view {
    height: 40vh;
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

  .color-text-block {
    display: flex;
    width: min-content;
    margin-left: auto;
    margin-right: auto;
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

  #submit-button {
    background-color: #1ac2ff;
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    color: #FFFFFF;
    border-radius: 8px;
    padding: 20px 45px;
    margin: 20px auto;
  }
  #submit-button:hover {
    cursor: pointer;
  }

  #statistics-block h1 {
    font-family: Raleway;
    margin: 0;
  }

  #result-block {
    position: relative;
    width: fit-content;
    height: fit-content;
  }

  #result-block img {
    z-index: 9;
  }

  #result-block canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }

  #result-window {
    min-height: 75vh;
  }
</style>