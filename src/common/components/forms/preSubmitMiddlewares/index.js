import xssValidationOnSubmit, { getFieldsWithScripts } from "./xssValidationOnSubmit.jsx";
import valuesTrimmer, { getTrimmedValues } from "./valuesTrimmer.jsx";
import { createPipelineForSingleArg } from "../../../../services/tools";
const preSubmitMiddlewares = onSubmit => createPipelineForSingleArg(valuesTrimmer, xssValidationOnSubmit)(onSubmit);

export default preSubmitMiddlewares;

export { getFieldsWithScripts, getTrimmedValues };