const pipeline = [
    {
        "name":"Split volumes",
        "input":[
            {
                "command-line-flag":"",
                "name":"Input",
                "optional": false,
                "list": true,
                "command-line-key":"[input]",
                "type": "File",
                "id":"input_file",
                "Description": "Raw multi phase .nii.gz or .nii file",
                "extension":["nii.gz", "nii"]
            },
            {
                "command-line-flag":"-sub",
                "name":"sub",
                "optional": true,
                "list": false,
                "command-line-key":"-sub",
                "type": "Number",
                "id":"sub",
                "Description": "sub the volume with average intensity for late images, to mark out the infarct",
                "extension":null
            },
            {
                "command-line-flag":"-ref [reference]",
                "name":"Reference",
                "optional": true,
                "list": false,
                "command-line-key":"-ref [reference]",
                "type": "Number",
                "id":"ref",
                "Description": "use reference's orientation and origin",
                "extension":null
            },
            {
                "command-line-flag":"-sequence",
                "name":"Sequence",
                "optional": true,
                "list": false,
                "command-line-key":"-sequence",
                "type": "Number",
                "id":"sequence",
                "Description": "split the volume into independent time frames",
                "extension":null
            },
            {
                "command-line-flag":"-slice",
                "name":"Slice",
                "optional": true,
                "list": false,
                "command-line-key":"-slice",
                "type": "Number",
                "id":"slice",
                "Description": "split the volume into independent slices (each slice can have a number of time frames)",
                "extension":null
            }

        ],
        "command-line": "Usage: splitvolume [input] [out] <options>",
        "output":[
            {
                "command-line-flag":"",
                "name":"Output",
                "optional": true,
                "list": true,
                "command-line-key":"[out]",
                "type": "File",
                "id":"output_file",
                "Description": "Output files",
                "extension":["nii.gz", "nii"]
            }
        ],
        "tool-version":"",
        "schema-version":"1.0",
        "description":"Split volumes"
    },
    {
        "name":"Brain localizer",
        "input":[
            {
                "command-line-flag":"",
                "name":"Input",
                "optional": false,
                "list": false,
                "command-line-key":"[input]",
                "type": "File",
                "id":"input_file",
                "Description": "Raw single phase .nii.gz or .nii file",
                "extension":["nii.gz", "nii"]
            },
            {
                "command-line-flag":"-v",
                "name":"v",
                "optional": true,
                "list": false,
                "command-line-key":"-v",
                "type": "Number",
                "id":"video",
                "Description": "Whether video file is required or not(default: 1)",
                "extension":null
            }
        ],

        "command-line": "detectBrain subject_T2.nii.gz output_folder",
        "output":[
            {
                "command-line-flag":"",
                "name":"Output",
                "optional": true,
                "list": true,
                "command-line-key":"",
                "type": "File",
                "id":"output_file",
                "Description": "Output file",
                "extension":["nii.gz", "nii"]
            }
        ],
        "tool-version":"",
        "schema-version":"1.0",
        "description":"This script localizer the brain region and provides binary mask enclosing fetal brain"
    },
    {
        "name": "SVR reconstruction",
        "input": [
            {
                "command-line-flag":"-i",
                "name":"Input",
                "optional": false,
                "list": true,
                "command-line-key":"[input]",
                "type": "File",
                "id":"input_file",
                "Description": "[stack_1] .. [stack_N]  The input stacks Nifti or Analyze format.",
                "extension":["nii.gz", "nii"]
            },
            {
                "command-line-flag":"-m",
                "name":"Mask",
                "optional": false,
                "list": false,
                "command-line-key":"[mask]",
                "type": "File",
                "id":"mask_file",
                "Description": "Binary mask to define the region od interest. Nifti or Analyze format.",
                "extension":["nii.gz", "nii"]
            },
            {
                "command-line-flag":"-m",
                "name":"Resolution",
                "optional": true,
                "list": false,
                "command-line-key":"[resolution]",
                "type": "Number",
                "id":"resolution",
                "Description": "Binary mask to define the region od interest. Nifti or Analyze format.",
                "extension":""
            },
            {
                "command-line-flag":"-m",
                "name":"Iterations",
                "optional": false,
                "list": false,
                "command-line-key":"[iterations]",
                "type": "Number",
                "id":"resolution",
                "Description": "Number of registration-reconstruction iterations.",
                "extension":""
            },
        ],
        "output": [
            {
                "command-line-flag":"-o",
                "name": "Output",
                "option": false,
                "list" : false,
                "command-line-key":"",
                "type": "File",
                "id": "output_file",
                "description" :"",
                "extension":["nii.gz", "nii"]
            }
        ],
        "tool-version":" ",
        "schema-version": "1.0",
        "description": ""
    },
    {
        "inputs": [
            {
                "command-line-flag": "--angle_rep",
                "name": "Angle rep",
                "optional": true,
                "list": false,
                "command-line-key": "[ANGLE_REP]",
                "type": "String",
                "id": "input_angle_rep",
                "description": "'quaternion' or 'euler'. Representation of rotation angles."
            },
            {
                "command-line-flag": "--apply_isoxfm",
                "name": "Apply isoxfm",
                "optional": true,
                "list": false,
                "command-line-key": "[APPLY_ISOXFM]",
                "type": "Number",
                "id": "input_apply_isoxfm",
                "description": "A float. As applyxfm but forces isotropic resampling."
            },
            {
                "command-line-flag": "--apply_xfm",
                "name": "Apply xfm",
                "optional": true,
                "list": false,
                "command-line-key": "[APPLY_XFM]",
                "type": "String",
                "id": "input_apply_xfm",
                "description": "A boolean. Apply transformation supplied by in_matrix_file."
            },
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--bbrslope",
                "name": "Bbrslope",
                "optional": true,
                "list": false,
                "command-line-key": "[BBRSLOPE]",
                "type": "Number",
                "id": "input_bbrslope",
                "description": "A float. Value of bbr slope."
            },
            {
                "command-line-flag": "--bbrtype",
                "name": "Bbrtype",
                "optional": true,
                "list": false,
                "command-line-key": "[BBRTYPE]",
                "type": "String",
                "id": "input_bbrtype",
                "description": "'signed' or 'global_abs' or 'local_abs'. Type of bbr cost function: signed [default], global_abs, local_abs."
            },
            {
                "command-line-flag": "--bgvalue",
                "name": "Bgvalue",
                "optional": true,
                "list": false,
                "command-line-key": "[BGVALUE]",
                "type": "Number",
                "id": "input_bgvalue",
                "description": "A float. Use specified background value for points outside fov."
            },
            {
                "command-line-flag": "--bins",
                "name": "Bins",
                "optional": true,
                "list": false,
                "command-line-key": "[BINS]",
                "type": "Number",
                "id": "input_bins",
                "description": "An integer (int or long). Number of histogram bins."
            },
            {
                "command-line-flag": "--coarse_search",
                "name": "Coarse search",
                "optional": true,
                "list": false,
                "command-line-key": "[COARSE_SEARCH]",
                "type": "Number",
                "id": "input_coarse_search",
                "description": "An integer (int or long). Coarse search delta angle."
            },
            {
                "command-line-flag": "--cost",
                "name": "Cost",
                "optional": true,
                "list": false,
                "command-line-key": "[COST]",
                "type": "String",
                "id": "input_cost",
                "description": "'mutualinfo' or 'corratio' or 'normcorr' or 'normmi' or 'leastsq' or 'labeldiff' or 'bbr'. Cost function."
            },
            {
                "command-line-flag": "--cost_func",
                "name": "Cost func",
                "optional": true,
                "list": false,
                "command-line-key": "[COST_FUNC]",
                "type": "String",
                "id": "input_cost_func",
                "description": "'mutualinfo' or 'corratio' or 'normcorr' or 'normmi' or 'leastsq' or 'labeldiff' or 'bbr'. Cost function."
            },
            {
                "command-line-flag": "--datatype",
                "name": "Datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[DATATYPE]",
                "type": "String",
                "id": "input_datatype",
                "description": "'char' or 'short' or 'int' or 'float' or 'double'. Force output data type."
            },
            {
                "command-line-flag": "--display_init",
                "name": "Display init",
                "optional": true,
                "list": false,
                "command-line-key": "[DISPLAY_INIT]",
                "type": "String",
                "id": "input_display_init",
                "description": "A boolean. Display initial matrix."
            },
            {
                "command-line-flag": "--dof",
                "name": "Dof",
                "optional": true,
                "list": false,
                "command-line-key": "[DOF]",
                "type": "Number",
                "id": "input_dof",
                "description": "An integer (int or long). Number of transform degrees of freedom."
            },
            {
                "command-line-flag": "--echospacing",
                "name": "Echospacing",
                "optional": true,
                "list": false,
                "command-line-key": "[ECHOSPACING]",
                "type": "Number",
                "id": "input_echospacing",
                "description": "A float. Value of epi echo spacing - units of seconds."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--fieldmap",
                "name": "Fieldmap",
                "optional": true,
                "list": false,
                "command-line-key": "[FIELDMAP]",
                "type": "String",
                "id": "input_fieldmap",
                "description": "A file name. Fieldmap image in rads/s - must be already registered to the reference image."
            },
            {
                "command-line-flag": "--fieldmapmask",
                "name": "Fieldmapmask",
                "optional": true,
                "list": false,
                "command-line-key": "[FIELDMAPMASK]",
                "type": "String",
                "id": "input_fieldmapmask",
                "description": "A file name. Mask for fieldmap image."
            },
            {
                "command-line-flag": "--fine_search",
                "name": "Fine search",
                "optional": true,
                "list": false,
                "command-line-key": "[FINE_SEARCH]",
                "type": "Number",
                "id": "input_fine_search",
                "description": "An integer (int or long). Fine search delta angle."
            },
            {
                "command-line-flag": "--force_scaling",
                "name": "Force scaling",
                "optional": true,
                "list": false,
                "command-line-key": "[FORCE_SCALING]",
                "type": "String",
                "id": "input_force_scaling",
                "description": "A boolean. Force rescaling even for low-res images."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "String",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Input file."
            },
            {
                "command-line-flag": "--in_matrix_file",
                "name": "In matrix file",
                "optional": true,
                "list": false,
                "command-line-key": "[IN_MATRIX_FILE]",
                "type": "String",
                "id": "input_in_matrix_file",
                "description": "A file name. Input 4x4 affine matrix."
            },
            {
                "command-line-flag": "--in_weight",
                "name": "In weight",
                "optional": true,
                "list": false,
                "command-line-key": "[IN_WEIGHT]",
                "type": "File",
                "id": "input_in_weight",
                "description": "An existing file name. File for input weighting volume."
            },
            {
                "command-line-flag": "--interp",
                "name": "Interp",
                "optional": true,
                "list": false,
                "command-line-key": "[INTERP]",
                "type": "String",
                "id": "input_interp",
                "description": "'trilinear' or 'nearestneighbour' or 'sinc' or 'spline'. Final interpolation method used in reslicing."
            },
            {
                "command-line-flag": "--min_sampling",
                "name": "Min sampling",
                "optional": true,
                "list": false,
                "command-line-key": "[MIN_SAMPLING]",
                "type": "Number",
                "id": "input_min_sampling",
                "description": "A float. Set minimum voxel dimension for sampling."
            },
            {
                "command-line-flag": "--no_clamp",
                "name": "No clamp",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_CLAMP]",
                "type": "String",
                "id": "input_no_clamp",
                "description": "A boolean. Do not use intensity clamping."
            },
            {
                "command-line-flag": "--no_resample",
                "name": "No resample",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_RESAMPLE]",
                "type": "String",
                "id": "input_no_resample",
                "description": "A boolean. Do not change input sampling."
            },
            {
                "command-line-flag": "--no_resample_blur",
                "name": "No resample blur",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_RESAMPLE_BLUR]",
                "type": "String",
                "id": "input_no_resample_blur",
                "description": "A boolean. Do not use blurring on downsampling."
            },
            {
                "command-line-flag": "--no_search",
                "name": "No search",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_SEARCH]",
                "type": "String",
                "id": "input_no_search",
                "description": "A boolean. Set all angular searches to ranges 0 to 0."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Registered output file."
            },
            {
                "command-line-flag": "--out_log",
                "name": "Out log",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_LOG]",
                "type": "String",
                "id": "input_out_log",
                "description": "A file name. Output log."
            },
            {
                "command-line-flag": "--out_matrix_file",
                "name": "Out matrix file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_MATRIX_FILE]",
                "type": "String",
                "id": "input_out_matrix_file",
                "description": "A file name. Output affine matrix in 4x4 asciii format."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--padding_size",
                "name": "Padding size",
                "optional": true,
                "list": false,
                "command-line-key": "[PADDING_SIZE]",
                "type": "Number",
                "id": "input_padding_size",
                "description": "An integer (int or long). For applyxfm: interpolates outside image by size."
            },
            {
                "command-line-flag": "--pedir",
                "name": "Pedir",
                "optional": true,
                "list": false,
                "command-line-key": "[PEDIR]",
                "type": "Number",
                "id": "input_pedir",
                "description": "An integer (int or long). Phase encode direction of epi - 1/2/3=x/y/z & -1/-2/-3=-x/-y/-z."
            },
            {
                "command-line-flag": "--ref_weight",
                "name": "Ref weight",
                "optional": true,
                "list": false,
                "command-line-key": "[REF_WEIGHT]",
                "type": "File",
                "id": "input_ref_weight",
                "description": "An existing file name. File for reference weighting volume."
            },
            {
                "command-line-flag": "--reference",
                "name": "Reference",
                "optional": false,
                "list": false,
                "command-line-key": "[REFERENCE]",
                "type": "File",
                "id": "input_reference",
                "description": "An existing file name. Reference file."
            },
            {
                "command-line-flag": "--rigid2D",
                "name": "Rigid2d",
                "optional": true,
                "list": false,
                "command-line-key": "[RIGID2D]",
                "type": "String",
                "id": "input_rigid2D",
                "description": "A boolean. Use 2d rigid body mode - ignores dof."
            },
            {
                "command-line-flag": "--save_log",
                "name": "Save log",
                "optional": true,
                "list": false,
                "command-line-key": "[SAVE_LOG]",
                "type": "String",
                "id": "input_save_log",
                "description": "A boolean. Save to log file."
            },
            {
                "command-line-flag": "--schedule",
                "name": "Schedule",
                "optional": true,
                "list": false,
                "command-line-key": "[SCHEDULE]",
                "type": "File",
                "id": "input_schedule",
                "description": "An existing file name. Replaces default schedule."
            },
            {
                "command-line-flag": "--searchr_x",
                "name": "Searchr x",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_X]",
                "type": "Number",
                "id": "input_searchr_x",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along x-axis, in degrees."
            },
            {
                "command-line-flag": "--searchr_y",
                "name": "Searchr y",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_Y]",
                "type": "Number",
                "id": "input_searchr_y",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along y-axis, in degrees."
            },
            {
                "command-line-flag": "--searchr_z",
                "name": "Searchr z",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_Z]",
                "type": "Number",
                "id": "input_searchr_z",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along z-axis, in degrees."
            },
            {
                "command-line-flag": "--sinc_width",
                "name": "Sinc width",
                "optional": true,
                "list": false,
                "command-line-key": "[SINC_WIDTH]",
                "type": "Number",
                "id": "input_sinc_width",
                "description": "An integer (int or long). Full-width in voxels."
            },
            {
                "command-line-flag": "--sinc_window",
                "name": "Sinc window",
                "optional": true,
                "list": false,
                "command-line-key": "[SINC_WINDOW]",
                "type": "String",
                "id": "input_sinc_window",
                "description": "'rectangular' or 'hanning' or 'blackman'. Sinc window."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            },
            {
                "command-line-flag": "--uses_qform",
                "name": "Uses qform",
                "optional": true,
                "list": false,
                "command-line-key": "[USES_QFORM]",
                "type": "String",
                "id": "input_uses_qform",
                "description": "A boolean. Initialize using sform or qform."
            },
            {
                "command-line-flag": "--verbose",
                "name": "Verbose",
                "optional": true,
                "list": false,
                "command-line-key": "[VERBOSE]",
                "type": "Number",
                "id": "input_verbose",
                "description": "An integer (int or long). Verbose mode, 0 is least."
            },
            {
                "command-line-flag": "--wm_seg",
                "name": "Wm seg",
                "optional": true,
                "list": false,
                "command-line-key": "[WM_SEG]",
                "type": "String",
                "id": "input_wm_seg",
                "description": "A file name. White matter segmentation volume needed by bbr cost function."
            },
            {
                "command-line-flag": "--wmcoords",
                "name": "Wmcoords",
                "optional": true,
                "list": false,
                "command-line-key": "[WMCOORDS]",
                "type": "String",
                "id": "input_wmcoords",
                "description": "A file name. White matter boundary coordinates for bbr cost function."
            },
            {
                "command-line-flag": "--wmnorms",
                "name": "Wmnorms",
                "optional": true,
                "list": false,
                "command-line-key": "[WMNORMS]",
                "type": "String",
                "id": "input_wmnorms",
                "description": "A file name. White matter boundary normals for bbr cost function."
            }
        ],
        "name": "FLIRT",
        "command-line": "nipype_cmd nipype.interfaces.fsl FLIRT [ANGLE_REP] [APPLY_ISOXFM] [APPLY_XFM] [ARGS] [BBRSLOPE] [BBRTYPE] [BGVALUE] [BINS] [COARSE_SEARCH] [COST] [COST_FUNC] [DATATYPE] [DISPLAY_INIT] [DOF] [ECHOSPACING] [ENVIRON] [FIELDMAP] [FIELDMAPMASK] [FINE_SEARCH] [FORCE_SCALING] [IGNORE_EXCEPTION] [IN_FILE] [IN_MATRIX_FILE] [IN_WEIGHT] [INTERP] [MIN_SAMPLING] [NO_CLAMP] [NO_RESAMPLE] [NO_RESAMPLE_BLUR] [NO_SEARCH] [OUT_FILE] [OUT_LOG] [OUT_MATRIX_FILE] [OUTPUT_TYPE] [PADDING_SIZE] [PEDIR] [REF_WEIGHT] [REFERENCE] [RIGID2D] [SAVE_LOG] [SCHEDULE] [SEARCHR_X] [SEARCHR_Y] [SEARCHR_Z] [SINC_WIDTH] [SINC_WINDOW] [TERMINAL_OUTPUT] [USES_QFORM] [VERBOSE] [WM_SEG] [WMCOORDS] [WMNORMS] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output-files": [
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            },
            {
                "path-template": "[OUT_LOG]",
                "optional": true,
                "type": "File",
                "name": "Out log",
                "id": "output_out_log"
            },
            {
                "path-template": "[OUT_MATRIX_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out matrix file",
                "id": "output_out_matrix_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "FLIRT, as implemented in Nipype (module: nipype.interfaces.fsl, interface: FLIRT)."
    }
]

export default pipeline;