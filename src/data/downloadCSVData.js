const parameters =
    [
        {
            "header":"Subject Details",
            "db":"SubjectDetail",
            "params": [
                {"label":"Subject ID", "param":"subject_id" , "type": "value"},
                {"label":"Scan", "param":"scan" , "type": "value"},
                {"label":"Cohort", "param":"cohort" , "type": "value"},
                {"label":"Gestational Age", "param":"gestational_age" , "type": "value"},
                {"label":"Study Group", "param":"study_group" , "type": "value"},
                {"label":"Modalities available", "param":"modalities_available" , "type": "value"},
                {"label":"Scan name", "param":"sname" , "type": "value"}
            ]
        },
        {
            "header":"Structural Files",
            "db":"MasterFileSystem",
            "params": [
                {"label": "recon", "param": "recon", "type": "array", "name":"name"},
                {"label": "T2", "param": "T2", "type": "array", "name":"name"},
                {"label": "brain_mask", "param": "brain_mask", "type": "array", "name":"name"},
                {"label": "bias", "param": "bias", "type": "array", "name":"name"},
                {"label": "transformed", "param": "transformed", "type": "array", "name":"name"},
                {"label": "arbitrary_mask", "param": "arbitrary_mask", "type": "array", "name":"name"},
                {"label": "segmentations", "param": "segmentations", "type": "array", "name":"name"},
                {"label": "raw_files", "param": "raw_files", "type": "array", "name":"name"},
                {"label": "extracted_brain", "param": "extracted_brain", "type": "array", "name":"name"},
                {"label": "segmentation_mask", "param": "segmentation_mask", "type": "array", "name":"name"},
            ]
        },
        {
            "header":"Measurements",
            "db":"SubjectROI",
            "params":[
                {"label":"external_csf", "param":"external_csf", "type": "value"},
                {"label":"cortical_gray_matter", "param":"cortical_gray_matter", "type": "value"},
                {"label":"white_matter", "param":"white_matter", "type": "value"},
                {"label":"background", "param":"background", "type": "value"},
                {"label":"ventricle_lateral", "param":"ventricle_lateral", "type": "value"},
                {"label":"cerebellum", "param":"cerebellum", "type": "value"},
                {"label":"subcortical_gray_matter", "param":"subcortical_gray_matter", "type": "value"},
                {"label":"brainstem", "param":"brainstem", "type": "value"},
                {"label":"amygdala_hippocampus", "param":"amygdala_hippocampus", "type": "value"},
                {"label":"ventricle_3", "param":"ventricle_3", "type": "value"},
                {"label":"ventricle_4", "param":"ventricle_4", "type": "value"},
                {"label":"cerebrum", "param":"cerebrum", "type": "value"},
                {"label":"totalbrainvolume", "param":"totalbrainvolume", "type": "value"},
                {"label":"placenta_volume", "param":"placenta_volume", "type": "value"},
                {"label":"maternal_volume", "param":"maternal_volume", "type": "value"},
                {"label":"myoinositol", "param":"myoinositol", "type": "value"},
                {"label":"lactate", "param":"lactate", "type": "value"},
                {"label":"totalcholine", "param":"totalcholine", "type": "value"},
                {"label":"totalnaa", "param":"totalnaa", "type": "value"},
                {"label":"totalcreatine", "param":"totalcreatine", "type": "value"},
            ]
        }
    ]

export default parameters;
