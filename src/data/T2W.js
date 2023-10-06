const subjects_list =[
    {
        "fetal_number":"fetus_00121",
        "scan_number":"01",
        "subject_id":"fetus_00121_01",
        "gestation_age":"23.34",
        "gender":"Male",
        "study_group":"R01"
    },
    {
        "fetal_number":"fetus_00121",
        "scan_number":"01",
        "subject_id":"fetus_00121_01",
        "gestation_age":"23.34",
        "gender":"Male",
        "study_group":"R01"
    }
]

const t2w = [
    {
        subject_id: "fetus_00001_01",
            "raw": [
                {"T2":"something.nii.gz"},
            ],
            "preproc": [
                {"splitvolumes":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"svrrecon":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"brain_extraction":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"n4":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}}
            ],
            "postproc": [
                {"segmentation":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"segmentation_data":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}}
            ],
            "results": [
                {"cerebellum":123},
                {"total_brain_volume":123}
            ]
    },
    {
            "subject_id": "fetus_00001_02",
            "raw": [
                {"T2":"something.nii.gz"},
            ],
            "preproc": [
                {"splitvolumes":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"svrrecon":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"brain_extraction":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"n4":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}}
            ],
            "postproc": [
                {"segmentation":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}},
                {"segmentation_data":{"filename":"something.nii.gz","size":"123","date_modified":"10/02/1990"}}
            ],
            "results": [
                {"cerebellum":1213},
                {"total_brain_volume":1213}
            ]
    }
    ]
export default t2w
// t2w.map((each_subject) => {
//     Object.keys(each_subject).map((params) => {
//         if (Array.isArray(each_subject[params]) !== false){
//             var filenames = each_subject[params]
//             filenames.map((sub_params) => {
//                 console.log(Object.keys(sub_params))
//             })
//         }
//     })
// })
// console.log(subjects_list)

