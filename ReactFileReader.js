import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ReactFileReader extends Component {
    fileInput = null;

    setFileInput = (element) => {
      this.fileInput = element
    }

    clickInput = () => {
      const element = this.fileInput
      element.value = ''
      element.click()
    }

    handleFiles = (event) => {
      const { base64, handleFiles } = this.props
      if (base64) {
        this.convertFilesToBase64(event.target.files)
      } else {
        handleFiles(event.target.files)
      }
    }

    convertFilesToBase64 = (fileList) => {
      const ef = fileList
      const { multipleFiles, handleFiles } = this.props

      if (multipleFiles) {
        const files = { base64: [], fileList: ef }

        ef.forEach((item) => {
          const reader = new FileReader()
          const f = item

          reader.onloadend = (e) => {
            files.base64.push(reader.result)

            if (files.base64.length === ef.length) {
              handleFiles(files)
            }
          }

          reader.readAsDataURL(f)
        })
      } else {
        const files = { base64: '', fileList: ef }
        const f = ef[0]
        const reader = new FileReader()

        reader.onloadend = (e) => {
          files.base64 = reader.result
          handleFiles(files)
        }

        reader.readAsDataURL(f)
      }
    }

    render () {
      const hideInput = {
        width: '0px',
        opacity: '0',
        position: 'fixed'
      }
      const {
        elementId,
        fileTypes,
        multipleFiles,
        disabled,
        children
      } = this.props

      const optionalAttributes = {}
      if (elementId) {
        optionalAttributes.id = elementId
      }

      return (
        <div className="react-file-reader">
          <input
            type="file"
            onChange={this.handleFiles}
            accept={Array.isArray(fileTypes) ? fileTypes.join(',') : fileTypes}
            className="react-file-reader-input"
            ref={this.setFileInput}
            multiple={multipleFiles}
            style={hideInput}
            disabled={disabled}
            {...optionalAttributes}
          />
          <div className="react-file-reader-button" role="presentation" onClick={this.clickInput}>
            {children}
          </div>
        </div>
      )
    }
}

ReactFileReader.defaultProps = {
  fileTypes: 'image/*',
  multipleFiles: false,
  base64: false,
  disabled: false,
  elementId: ''
}

ReactFileReader.propTypes = {
  multipleFiles: PropTypes.bool,
  handleFiles: PropTypes.func.isRequired,
  fileTypes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  base64: PropTypes.bool,
  children: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
  elementId: PropTypes.string
}
