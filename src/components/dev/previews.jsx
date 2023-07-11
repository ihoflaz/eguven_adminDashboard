import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox-next'
import {PaletteTree} from './palette'
import App from "../../pages/_app";
import Page from "../../pages/esign/[userId]";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree/>}>
      <ComponentPreview path="/App">
        <App/>
      </ComponentPreview>
      <ComponentPreview path="/Page">
        <Page/>
      </ComponentPreview>
    </Previews>
  )
}

export default ComponentPreviews