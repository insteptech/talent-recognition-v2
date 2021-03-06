//Modified the original "react-numeric-input" becaause we do not wanted to include package. Package size was bit bigger side.
import React, { Component } from "react";
import PropTypes from "prop-types";

const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const IS_BROWSER = typeof document !== "undefined";
const RE_NUMBER = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
const RE_INCOMPLETE_NUMBER = /^([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?$/;

/**
 * Just a simple helper to provide support for older IEs. This is not exactly a
 * polyfill for classList.add but it does what we need with minimal effort.
 * Works with single className only!
 */
function addClass(element, className) {
    if (element.classList) {
        return element.classList.add(className);
    }
    if (!element.className.search(new RegExp("\\b" + className + "\\b"))) {
        element.className = " " + className;
    }
}

/**
 * Just a simple helper to provide support for older IEs. This is not exactly a
 * polyfill for classList.remove but it does what we need with minimal effort.
 * Works with single className only!
 */
function removeClass(element, className) {
    if (element.className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        element.className = element.className.replace(new RegExp("\\b" + className + "\\b", "g"), "");
    }
}
/**
 * Lookup the object.prop and returns it. If it happens to be a function,
 * executes it with args and returns it"s return value. It the prop does not
 * exist on the object, or if it equals undefined, or if it is a function that
 * returns undefined the defaultValue will be returned instead.
 * @param  {Object} object       The object to look into
 * @param  {String} prop         The property name
 * @param  {*}      defaultValue The default value
 * @param  {*[]}    args         Any additional arguments to pass to the
 *                               function (if the prop is a function).
 * @return {*}                   Whatever happens to be the return value
 */
function access(object, prop, defaultValue, ...args) {
    let result = object[prop];
    if (typeof result === "function") {
        result = result(...args);
    }
    return result === undefined ? defaultValue : result;
}

class NumericInput extends Component {
    static propTypes = {
        step: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        min: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        max: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        maxLength: PropTypes.number,
        parse: PropTypes.func,
        format: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        readOnly: PropTypes.bool,
        required: PropTypes.bool,
        noValidate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        type: PropTypes.string,
        pattern: PropTypes.string,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onKeyDown: PropTypes.func,
        onChange: PropTypes.func,
        onInvalid: PropTypes.func,
        onValid: PropTypes.func,
        onInput: PropTypes.func,
        onSelect: PropTypes.func,
        size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        strict: PropTypes.bool,
        componentClass: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    };

    /**
     * The default behavior is to start from 0, use step of 1 and display
     * integers
     */
    static defaultProps = {
        step: 1,
        min: Number.MIN_SAFE_INTEGER || -9007199254740991,
        max: Number.MAX_SAFE_INTEGER || 9007199254740991,
        parse: null,
        format: null,
        strict: false,
        componentClass: "input",
    };

    /**
     * This are the default styles that act as base for all the component
     * instances. One can modify this object to change the default styles
     * of all the widgets on the page.
     */
    static style = {
        // The wrapper (span)
        wrap: {
            position: "relative",
            display: "inline-block",
        },

        "wrap.hasFormControl": {
            display: "block",
        },
    };

    /**
     * When click and hold on a button - the speed of auto changing the value.
     * This is a static property and can be modified if needed.
     */
    static SPEED = 50;

    /**
     * When click and hold on a button - the delay before auto changing the value.
     * This is a static property and can be modified if needed.
     */
    static DELAY = 500;

    /**
     * The constant indicating up direction (or increasing in general)
     */
    static DIRECTION_UP = "up";

    /**
     * The constant indicating down direction (or decreasing in general)
     */
    static DIRECTION_DOWN = "down";

    /**
     * The step timer
     * @type {Number}
     */
    _timer;

    /**
     * This holds the last known validation error. We need to compare that with
     * new errors and detect validation changes...
     * @type {[type]}
     */
    _valid;

    _isStrict;
    _ignoreValueChange;
    _isMounted;
    _inputFocus;
    onTouchEnd;
    refsWrapper;
    refsInput;

    /**
     * The state of the component
     * @type {Object}
     */
    state;

    /**
     * The stop method (need to declare it here to use it in the constructor)
     * @type {Function}
     */
    stop;

    /**
     * Set the initial state and bind this.stop to the instance.
     */
    constructor(...args) {
        super(...args);

        this._isStrict = !!this.props.strict;
        this.state = {
            btnDownHover: false,
            btnDownActive: false,
            btnUpHover: false,
            btnUpActive: false,
            stringValue: "",
            ...this._propsToState(this.props),
        };
        this.stop = this.stop.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.refsInput = {};
        this.refsWrapper = {};
    }

    _propsToState(props) {
        let out = {};
        if (props.hasOwnProperty("value")) {
            out.stringValue = String(props.value || props.value === 0 ? props.value : "").trim();
            out.value = out.stringValue !== "" ? this._parse(props.value) : null;
        } else if (!this._isMounted && props.hasOwnProperty("defaultValue")) {
            out.stringValue = String(props.defaultValue || props.defaultValue === 0 ? props.defaultValue : "").trim();

            out.value = props.defaultValue !== "" ? this._parse(props.defaultValue) : null;
        }
        return out;
    }

    /**
     * Special care is taken for the "value" prop:
     * - If not provided - set it to null
     * - If the prop is a number - use it as is
     * - Otherwise:
     *     1. Convert it to string (falsy values become "")
     *     2. Then trim it.
     *     3. Then parse it to number (delegating to this.props.parse if any)
     */
    /**
     * After the component has been rendered into the DOM, do whatever is
     * needed to "reconnect" it to the outer world, i.e. restore selection,
     * call some of the callbacks, validate etc.
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value || prevProps.defaultValue !== this.props.defaultValue) {
            this._isStrict = this.props.strict;
            let nextState = this._propsToState(this.props);
            if (Object.keys(nextState).length) {
                this._ignoreValueChange = true;
                this.setState(nextState, () => {
                    this._ignoreValueChange = false;
                });
            }
        }
        // Call the onChange if needed. This is placed here because there are
        // many reasons for changing the value and this is the common place
        // that can capture them all
        if (
            !this._ignoreValueChange && // no onChange if re-rendered with different value prop
            prevState.value !== this.state.value && // no onChange if the value remains the same
            (!isNaN(this.state.value) || this.state.value === null) // only if changing to number or null
        ) {
            this._invokeEventCallback("onChange", this.state.value, this.refsInput.value, this.refsInput);
        }
        // focus the input is needed (for example up/down buttons set
        // this._inputFocus to true)
        if (this._inputFocus) {
            this.refsInput.focus();
            // Restore selectionStart (if any)
            if (this.state.selectionStart || this.state.selectionStart === 0) {
                this.refsInput.selectionStart = this.state.selectionStart;
            }

            // Restore selectionEnd (if any)
            if (this.state.selectionEnd || this.state.selectionEnd === 0) {
                this.refsInput.selectionEnd = this.state.selectionEnd;
            }
        }

        this.checkValidity();
    }

    /**
     * This is used to clear the timer if any
     */
    componentWillUnmount() {
        this._isMounted = false;
        this.stop();
    }

    /**
     * Adds getValueAsNumber and setValue methods to the input DOM element.
     */
    componentDidMount() {
        this._isMounted = true;
        this.refsInput.getValueAsNumber = () => this.state.value || 0;

        this.refsInput.setValue = value => {
            this.setState({
                value: this._parse(value),
                stringValue: value,
            });
        };

        // This is a special case! If the component has the "autoFocus" prop
        // and the browser did focus it we have to pass that to the onFocus
        if (!this._inputFocus && IS_BROWSER && document.activeElement === this.refsInput) {
            this._inputFocus = true;
            this.refsInput.focus();
            this._invokeEventCallback("onFocus", {
                target: this.refsInput,
                type: "focus",
            });
        }
        this.checkValidity();
    }
    /**
     * Saves the input selection in the state so that it can be restored after
     * updates
     */
    saveSelection() {
        this.setState({
            selectionStart: this.refsInput.selectionStart,
            selectionEnd: this.refsInput.selectionEnd,
        });
    }

    /**
     * Unless noValidate is set to true, the component will check the
     * existing validation state (if any) and will toggle the "has-error"
     * CSS class on the wrapper
     */
    checkValidity() {
        let valid,
            validationError = "";

        let supportsValidation = !!this.refsInput.checkValidity;

        // noValidate
        let noValidate = !!(this.props.noValidate && this.props.noValidate !== "false");

        this.refsInput.noValidate = noValidate;

        // If "noValidate" is set or "checkValidity" is not supported then
        // consider the element valid. Otherwise consider it invalid and
        // make some additional checks below
        valid = noValidate || !supportsValidation;

        if (valid) {
            validationError = "";
        } else {
            // In some browsers once a pattern is set it cannot be removed. The
            // browser sets it to "" instead which results in validation
            // failures...
            if (this.refsInput.pattern === "") {
                this.refsInput.pattern = this.props.required ? ".+" : ".*";
            }

            // Now check validity
            if (supportsValidation) {
                this.refsInput.checkValidity();
                valid = this.refsInput.validity.valid;

                if (!valid) {
                    validationError = this.refsInput.validationMessage;
                }
            }

            // Some browsers might fail to validate maxLength
            if (valid && supportsValidation && this.props.maxLength) {
                if (this.refsInput.value.length > this.props.maxLength) {
                    validationError = "This value is too long";
                }
            }
        }

        validationError = validationError || (valid ? "" : this.refsInput.validationMessage || "Unknown Error");

        let validStateChanged = this._valid !== validationError;
        this._valid = validationError;
        if (validationError) {
            addClass(this.refsWrapper, "has-error");
            if (validStateChanged) {
                this._invokeEventCallback("onInvalid", validationError, this.state.value, this.refsInput.value);
            }
        } else {
            removeClass(this.refsWrapper, "has-error");
            if (validStateChanged) {
                this._invokeEventCallback("onValid", this.state.value, this.refsInput.value);
            }
        }
    }

    /**
     * Used internally to parse the argument x to it's numeric representation.
     * If the argument cannot be converted to finite number returns 0; If a
     */
    _toNumber(x) {
        let n = parseFloat(x);
        if (isNaN(n) || !isFinite(n)) {
            n = 0;
        }

        if (this._isStrict) {
            let q = Math.pow(10, 10);
            let _min = +access(this.props, "min", NumericInput.defaultProps.min, this);
            let _max = +access(this.props, "max", NumericInput.defaultProps.max, this);
            n = Math.min(Math.max(n, _min), _max);
            n = Math.round(n * q) / q;
        }
        return n;
    }

    /**
     * This is used internally to parse any string into a number. It will
     * delegate to this.props.parse function if one is provided. Otherwise it
     * will just use parseFloat.
     * @private
     */
    _parse(x) {
        x = String(x);
        if (typeof this.props.parse === "function") {
            return parseFloat(this.props.parse(x));
        }
        return parseFloat(x);
    }

    /**
     * This is used internally to format a number to it's display representation.
     * It will invoke the this.props.format function if one is provided.
     * @private
     */
    _format(n) {
        let _n = this._toNumber(n);
        _n += "";

        if (this.props.format) {
            return this.props.format(_n);
        }
        return _n;
    }
    /**
     * The internal method that actually sets the new value on the input
     * @private
     */
    _step(n, callback) {
        let _isStrict = this._isStrict;
        this._isStrict = true;
        let _step = +access(
            this.props,
            "step",
            NumericInput.defaultProps.step,
            this,
            n > 0 ? NumericInput.DIRECTION_UP : NumericInput.DIRECTION_DOWN
        );
        let _n = this._toNumber((this.state.value || 0) + _step * n);
        this._isStrict = _isStrict;
        if (_n !== this.state.value) {
            this.setState({ value: _n, stringValue: _n + "" }, callback);
            return true;
        }
        return false;
    }

    /**
     * This binds the Up/Down arrow key listeners
     */
    _onKeyDown(...args) {
        args[0].persist();
        this._invokeEventCallback("onKeyDown", ...args);
        let e = args[0];
        if (!e.isDefaultPrevented()) {
            if (e.keyCode === KEYCODE_UP) {
                e.preventDefault();
                this._step(e.ctrlKey || e.metaKey ? 0.1 : e.shiftKey ? 10 : 1);
            } else if (e.keyCode === KEYCODE_DOWN) {
                e.preventDefault();
                this._step(e.ctrlKey || e.metaKey ? -0.1 : e.shiftKey ? -10 : -1);
            } else {
                let value = this.refsInput.value,
                    length = value.length;
                if (e.keyCode === 8) {
                    // backspace
                    if (
                        this.refsInput.selectionStart === this.refsInput.selectionEnd &&
                        this.refsInput.selectionEnd > 0 &&
                        value.length &&
                        value.charAt(this.refsInput.selectionEnd - 1) === "."
                    ) {
                        e.preventDefault();
                        this.refsInput.selectionStart = this.refsInput.selectionEnd = this.refsInput.selectionEnd - 1;
                    }
                } else if (e.keyCode === 46) {
                    // delete
                    if (
                        this.refsInput.selectionStart === this.refsInput.selectionEnd &&
                        this.refsInput.selectionEnd < length + 1 &&
                        value.length &&
                        value.charAt(this.refsInput.selectionEnd) === "."
                    ) {
                        e.preventDefault();
                        this.refsInput.selectionStart = this.refsInput.selectionEnd = this.refsInput.selectionEnd + 1;
                    }
                }
            }
        }
    }

    /**
     * Stops the widget from auto-changing by clearing the timer (if any)
     */
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }
    /**
     * Increments the value with one step and the enters a recursive calls
     * after DELAY. This is bound to the mousedown event on the "up" button
     * and will be stopped on mouseout/mouseup.
     * @param {Boolean} _recursive The method is passing this to itself while
     *  it is in recursive mode.
     * @return void
     */
    increase(_recursive = false, callback) {
        this.stop();
        this._step(1, callback);
        let _max = +access(this.props, "max", NumericInput.defaultProps.max, this);
        if (isNaN(this.state.value) || +this.state.value < _max) {
            this._timer = setTimeout(
                () => {
                    this.increase(true);
                },
                _recursive ? NumericInput.SPEED : NumericInput.DELAY
            );
        }
    }

    /**
     * Decrements the value with one step and the enters a recursive calls
     * after DELAY. This is bound to the mousedown event on the "down" button
     * and will be stopped on mouseout/mouseup.
     * @param {Boolean} _recursive The method is passing this to itself while
     *  it is in recursive mode.
     * @return void
     */
    decrease(_recursive, callback) {
        this.stop();
        this._step(-1, callback);
        let _min = +access(this.props, "min", NumericInput.defaultProps.min, this);
        if (isNaN(this.state.value) || +this.state.value > _min) {
            this._timer = setTimeout(
                () => {
                    this.decrease(true);
                },
                _recursive ? NumericInput.SPEED : NumericInput.DELAY
            );
        }
    }

    /**
     * Handles the mousedown event on the up/down buttons. Changes The
     * internal value and sets up a delay for auto increment/decrement
     * (until mouseup or mouseleave)
     */
    onMouseDown(dir, callback) {
        if (dir === "down") {
            this.decrease(false, callback);
        } else if (dir === "up") {
            this.increase(false, callback);
        }
    }

    /**
     * Handles the touchstart event on the up/down buttons. Changes The
     * internal value and DOES NOT sets up a delay for auto increment/decrement.
     * Note that this calls e.preventDefault() so the event is not used for
     * creating a virtual mousedown after it
     */
    onTouchStart(dir, e) {
        e.preventDefault();
        if (dir === "down") {
            this.decrease();
        } else if (dir === "up") {
            this.increase();
        }
    }

    onTouchEnd(e) {
        e.preventDefault();
        this.stop();
    }

    /**
     * Helper method to invoke event callback functions if they are provided
     * in the props.
     * @param {String} callbackName The name of the function prop
     * @param {*[]} args Any additional argument are passed thru
     */
    _invokeEventCallback(callbackName, ...args) {
        if (typeof this.props[callbackName] === "function") {
            this.props[callbackName].call(null, ...args);
        }
    }

    /**
     * Renders an input wrapped in relative span and up/down buttons
     * @return {Component}
     */
    render() {
        let props = this.props;
        let state = this.state;
        let css = {};
        let {
            // These are ignored in rendering
            step,
            min,
            max,
            parse,
            format,
            componentClass,
            value,
            type,
            defaultValue,
            onInvalid,
            onValid,
            strict,
            // The rest are passed to the input
            ...rest
        } = this.props;
        // Build the styles
        for (let x in NumericInput.style) {
            css[x] = Object.assign({}, NumericInput.style[x], {});
        }
        let hasFormControl = props.className && /\bform-control\b/.test(props.className);
        let attrs = {
            wrap: {
                style: css.wrap,
                className: "react-numeric-input",
                ref: e => {
                    if (e !== null && e !== undefined) {
                        this.refsWrapper = e;
                    }
                },
                onMouseUp: undefined,
                onMouseLeave: undefined,
            },
            input: {
                ref: e => {
                    if (e !== null && e !== undefined) {
                        this.refsInput = e;
                    }
                },
                min: min,
                max: max,
                type: "number",
                style: Object.assign(
                    {},
                    !hasFormControl ? css["input:not(.form-control)"] : {},
                    this._inputFocus ? css["input:focus"] : {}
                ),
                ...rest,
            },
            btnUp: {
                onMouseEnter: undefined,
                onMouseDown: undefined,
                onMouseUp: undefined,
                onMouseLeave: undefined,
                onTouchStart: undefined,
                onTouchEnd: undefined,
                style: Object.assign(
                    {},
                    props.disabled || props.readOnly
                        ? css["btn:disabled"]
                        : state.btnUpActive
                        ? css["btn:active"]
                        : state.btnUpHover
                        ? css["btn:hover"]
                        : {}
                ),
            },
            btnDown: {
                onMouseEnter: undefined,
                onMouseDown: undefined,
                onMouseUp: undefined,
                onMouseLeave: undefined,
                onTouchStart: undefined,
                onTouchEnd: undefined,
                style: Object.assign(
                    {},
                    props.disabled || props.readOnly
                        ? css["btn:disabled"]
                        : state.btnDownActive
                        ? css["btn:active"]
                        : state.btnDownHover
                        ? css["btn:hover"]
                        : {}
                ),
            },
        };
        let stringValue = String(
            // if state.stringValue is set and not empty
            state.stringValue ||
                // else if state.value is set and not null|undefined
                (state.value || state.value === 0 ? state.value : "") ||
                // or finally use ""
               ""
        );
        let loose = !this._isStrict && (this._inputFocus || !this._isMounted);

        // incomplete number
        if (loose && RE_INCOMPLETE_NUMBER.test(stringValue)) {
            attrs.input.value = stringValue;
        } else if (loose && stringValue && !RE_NUMBER.test(stringValue)) {
            // Not a number and not empty (loose mode only)
            attrs.input.value = stringValue;
        } else if (state.value || state.value === 0) {
            // number
            attrs.input.value = this._format(state.value);
        } else {
            // empty
            attrs.input.value = "";
        }

        if (hasFormControl) {
            Object.assign(attrs.wrap.style, css["wrap.hasFormControl"]);
        }
        // Attach event listeners if the widget is not disabled
        if (!props.disabled && !props.readOnly) {
            Object.assign(attrs.wrap, {
                onMouseUp: this.stop,
                onMouseLeave: this.stop,
            });

            Object.assign(attrs.btnUp, {
                onTouchStart: this.onTouchStart.bind(this, "up"),
                onTouchEnd: this.onTouchEnd,
                onMouseEnter: () => {
                    this.setState({
                        btnUpHover: true,
                    });
                },
                onMouseLeave: () => {
                    this.stop();
                    this.setState({
                        btnUpHover: false,
                        btnUpActive: false,
                    });
                },
                onMouseUp: () => {
                    this.setState({
                        btnUpHover: true,
                        btnUpActive: false,
                    });
                },
                onMouseDown: (...args) => {
                    args[0].preventDefault();
                    args[0].persist();
                    this._inputFocus = true;
                    this.setState(
                        {
                            btnUpHover: true,
                            btnUpActive: true,
                        },
                        () => {
                            this._invokeEventCallback("onFocus", ...args);
                            this.onMouseDown("up");
                        }
                    );
                },
            });
            Object.assign(attrs.btnDown, {
                onTouchStart: this.onTouchStart.bind(this, "down"),
                onTouchEnd: this.onTouchEnd,
                onMouseEnter: () => {
                    this.setState({
                        btnDownHover: true,
                    });
                },
                onMouseLeave: () => {
                    this.stop();
                    this.setState({
                        btnDownHover: false,
                        btnDownActive: false,
                    });
                },
                onMouseUp: () => {
                    this.setState({
                        btnDownHover: true,
                        btnDownActive: false,
                    });
                },
                onMouseDown: (...args) => {
                    args[0].preventDefault();
                    args[0].persist();
                    this._inputFocus = true;
                    this.setState(
                        {
                            btnDownHover: true,
                            btnDownActive: true,
                        },
                        () => {
                            this._invokeEventCallback("onFocus", ...args);
                            this.onMouseDown("down");
                        }
                    );
                },
            });
            Object.assign(attrs.input, {
                onChange: e => {
                    const original = e.target.value;
                    let val = this._parse(original);
                    if (isNaN(val)) {
                        val = null;
                    }
                    this.setState({
                        value: this._isStrict ? this._toNumber(val) : val,
                        stringValue: original,
                    });
                },
                onKeyDown: this._onKeyDown.bind(this),
                onInput: (...args) => {
                    this.saveSelection();
                    this._invokeEventCallback("onInput", ...args);
                },
                onSelect: (...args) => {
                    this.saveSelection();
                    this._invokeEventCallback("onSelect", ...args);
                },
                onFocus: (...args) => {
                    args[0].persist();
                    this._inputFocus = true;
                    const val = this._parse(args[0].target.value);
                    this.setState(
                        {
                            value: val,
                            stringValue: val || val === 0 ? val + "" : "",
                        },
                        () => {
                            this._invokeEventCallback("onFocus", ...args);
                        }
                    );
                },
                onBlur: (...args) => {
                    let _isStrict = this._isStrict;
                    this._isStrict = true;
                    args[0].persist();
                    this._inputFocus = false;
                    const val = this._parse(args[0].target.value);
                    this.setState(
                        {
                            value: val,
                        },
                        () => {
                            this._invokeEventCallback("onBlur", ...args);
                            this._isStrict = _isStrict;
                        }
                    );
                },
            });
        } else {
            if (props.disabled) {
                Object.assign(attrs.input.style, css["input:disabled"]);
            }
        }
        const InputTag = componentClass || "input";
        return (
            <span {...attrs.wrap}>
                <InputTag {...attrs.input} />
                <b {...attrs.btnUp} className="btn btn-plus btn-up mobile">
                    <i className="glyphicon glyphicon-plus" />
                </b>
                <b {...attrs.btnDown} className="btn btn-minus btn-down mobile">
                    <i className="glyphicon glyphicon-minus" />
                </b>
            </span>
        );
    }
}

export default NumericInput;