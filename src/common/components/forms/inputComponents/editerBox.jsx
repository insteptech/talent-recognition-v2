import React, { Component, Fragment, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import PropTypes from "prop-types";
import CKEditor from 'ckeditor4-react';

class Editer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    setData = (e) => {
        this.props.input.onChange(e ? e : null)
    }

    render() {
        const { input } = this.props;
        const { } = this.state;
        return (
            <Fragment>
                <CKEditor
                    data={input.value}
                    onChange={({ editor }) => this.setData(editor.getData())}
                />
            </Fragment >
        )
    }
    static propTypes = {
        input: PropTypes.object.isRequired,
        validation: PropTypes.shape({
            required: PropTypes.bool,
        }),
    };
}

export default (Editer);
