macroScript TextureAnimation category:"Texture_Vertex_Animaton" buttontext:"Vertex Animation Tools" tooltip:"Vertex Animation Tools"
(
    ResumeEditing()
    escapeEnable = true
   
    global targetMorphUV = 2

    rollout TexMorphRollout "Vertex texture Animation Tool"
    (
        global originalMesh
        global copyBaseMesh
        global numberofVerts                                   --原始模型的顶点树木
        global originalMeshVertPositions = #()
        global MorphTargetArray
        global Morph_Floater
        global internalArrayOfStaticBaseMeshes=#()             --选中的模型们的一维数组
        global vertexUVPosition=#()                            --储存顶点模型的UV的位置
        global MorphNormalArray=#()
        global MorphVertOffsetArray=#()
        global MorphTargetProgressPercentage = 0.0
        global masterMorphArray=#()                             --二维数组，第一层为选中的模型，第二层为那个模型对应时间范围内的所有snapshot
        global noMeshesArray=#(" No meshes processed" as string)
        group "Morpher Meshes"
        (
            spinner spinnerAnimationRangeStart "Anim Start" type:#integer range:[0,1000000,animationRange.start]
            spinner spinnerAnimationRangeEnd "Anim End" type:#integer range:[0,1000000,animationRange.end]
            spinner spinnerAnimationRate "Frame step Skip" type:#integer range:[0,1000000,0]
            dropdownlist ddlTextureCoordinate "Texture Coordinate:" items:#("2","3","4","5","6","7","8") tooltip:"用第二套UV来放顶点动画的顶点位置"
            button CreateVertexAnimation "Create Vertex Animation"
        )
        button help "help"
       

        /*******************************************************************************功能函数**************************************************************************************/

        function CheckUnits =
        (
            if(units.SystemType != #Centimeters)
            then
            (
                messageBox "请校准好Max的系统单位，保持与Unity中的一致"
                return false
            )
            else
            (
                return true
            )
        )

        function CheckMesh selectmesh =
        (
            isvalidnode selectmesh and superclassof selectmesh == GeometryClass
        )

        function ClearMeshes =
        (
            if isValidNode masterMorphArray[1] and masterMorphArray.count >0 do
            (
                delete masterMorphArray
                masterMorphArray=#()
            )
        )

        function updateProgAmount i myArrayCount =
        (
            MorphTargetProgressPercentage=((i as float/myArrayCount as float)*100.0)
            progressUpdate MorphTargetProgressPercentage  
            if MorphTargetProgressPercentage == 100.0 do progressEnd()
            if getProgressCancel() == true do
            (
                progressEnd()
            ) -- returns true if cancelled
        )

        function ReInitVarriables =
        (
            masterMorphArray=#()
            MorphVertOffsetArray=#()
            originalMesh=undefined
            numberofVerts=0
            internalArrayOfStaticBaseMeshes=#()
            MorphTargetProgressPercentage=0.0
            originalMeshVertPositions=#()
            MorphNormalArray=#()
            tempMorphArray=#()
        )

        function MakeSnapShotsReturnArray MeshToSnapShot =
        (
            progressStart "Create morph targets"
            FrameArray = #()
            NumOfFrames = floor (spinnerAnimationRangeEnd.value - spinnerAnimationRangeStart.value)
            for i = 0 to NumOfFrames by (spinnerAnimationRate.value + 1)do
            (
                newtime = spinnerAnimationRangeStart.value + i
                newCopy = at time newtime snapshot MeshToSnapShot
                --deleteKeys newCopy #allKeys
                meshop.unifyNormals newCopy #{1..newCopy.numfaces}
                append FrameArray newCopy
            updateProgAmount i NumOfFrames
            )
            progressEnd()
            return FrameArray
        )

        function attachMeshes mesh1 mesh2 =
        (
            if classof mesh1 == editable_poly then mesh1.attach mesh2 mesh1
            else attach mesh1 mesh2
        )

        function fixUVNames polyToFix =
        (
            for i = 1 to (polyop.getNumMaps polyToFix) do (ChannelInfo.NameChannel polyToFix 3 i ("UVChannel_" + i as string))
        )

        function MakeAndMergeSnapShots ArrayOfMeshes =
        (
            if ArrayOfMeshes.count > 0 do
            (
                for i in ArrayOfMeshes do
                (
                    --把每一帧的模型全部snapshot出来，并且保存在全局变量masterMorphArray二维数组中的第二维。
                    if CheckMesh i do append masterMorphArray (MakeSnapShotsReturnArray i)
                )
                --如果有多个有关键帧的原始模型，则会把每帧的两个模型的关键帧克隆attach到一起，如果没有，下面的逻辑没跑
                masterMorphArray1Count = masterMorphArray[1].count
                if masterMorphArray.count > 1 do
                (
                    for i = 2 to masterMorphArray.count do
                    (
                        for framecount = 1 to masterMorphArray1Count do
                        (
                            currentMasterObject = masterMorphArray[1][framecount]
                            attachMeshes currentMasterObject masterMorphArray[i][framecount]
                        )
                    )
                )
                masterMorphArray = masterMorphArray[1]
            )
        )

        function SmoothCopyMesh Meshes =
        (
            OrgName = Meshes.name
            originalMesh = at time 0 snapshot Meshes
            originalMesh.name = OrgName + "_MorphUV" + (targetMorphUV as string) + "_MorphExport"
            s = smooth()
            s.smoothingBits = 1
            addModifier originalMesh s

            numberofVerts = getNumVerts originalMesh
            originalMeshVertPositions = #()  --清空位置数组，它是定义在全局的
            if ClassOf originalMesh.baseobject == Editable_Poly then
            (
                for i = 1 numberofVerts do
                (
                    append originalMeshVertPositions (in coordsys world polyop.getVert originalMesh i)
                )
            )
            else
            (
                for i = 1 to numberofVerts do
                (
                    append originalMeshVertPositions (in coordsys world getVert originalMesh i)
                )
            )
        )

        function PackVertexUVs myMesh =
        (
            progressStart "Packing the game mesh UVs"
            convertTo myMesh Editable_Poly
            for i = 1 to numberofVerts do
            (
                offset = 1.0 / (numberofVerts * 2)
                currentPosition = (((i as float)- 0.5) / numberofVerts)
                polyop.setVertColor myMesh targetMorphUV i [currentPosition*255.0 ,128.0 ,0]
                append vertexUVPosition currentPosition
                updateProgAmount i numberofVerts
            )
            fixUVNames myMesh
            progressEnd()
        )

        function getVertPos model index=
        (
            pos=[0,0,0]
            if classof model.baseobject == editable_poly then (
                pos=in coordsys world polyop.getVert model index
            ) else (
                pos=in coordsys world getVert model index
            )
            return pos
        )

        function populateMorphTargetArrays =
        (
            progressStart "Creating the Morph Targets"
            masterCount = masterMorphArray.count
            for i=1 to masterCount do
            (
                CurrentMorphTargetNormalArray = #()
                currentMorphTarget=masterMorphArray[i]
                global currentMorphVertexOffsetArray = #()
                MorphTargetProgressPercentage=updateProgAmount i masterCount
                for j=1 to numberofVerts do
                (
                    originalVertPos=originalMeshVertPositions[j]
                    currentModelVertPos = getVertPos currentMorphTarget j
                    currentOffset= (currentModelVertPos - originalVertPos)
                    currentOffset=[currentOffset[1],-1.0*currentOffset[2],currentOffset[3]]
                    currentOffset*=255.0
                    append currentMorphVertexOffsetArray currentOffset
                )
                append MorphVertOffsetArray currentMorphVertexOffsetArray
                append MorphNormalArray CurrentMorphTargetNormalArray
            )
        )

        function Rendertexture =
        (
            fopenexr.SetCompression 0
            fopenexr.setLayerOutputType 0 1 -- set layer 0  main layer to RGBA, RGB = 1
            fopenexr.setLayerOutputFormat 0 1 --0 32 sets main layer to float 16 via 1. other options are 0 float 32, 2 int 32
            global TextureName = getSaveFileName types:"EXR (*.EXR)|*.EXR"
            if TextureName == undefined then
            (
                messagebox "please select a file location"
            )
            else
            (
                uvString="_UV"+((targetMorphUV-1) as string)
                TextureNameOffset= replace TextureName (findString TextureName ".EXR") 4 (uvString+".EXR")
                global FinalTexture = bitmap numberofVerts (MorphVertOffsetArray.count) filename:TextureNameOffset hdr:true;
                for i=0 to (MorphVertOffsetArray.count-1) do
                (
                    setPixels FinalTexture [0, i] MorphVertOffsetArray[(i+1)]
                )
                save FinalTexture gamma:1.0
                close FinalTexture
            )
        )

        /*******************************************************************************UI交互函数**************************************************************************************/
        on CreateVertexAnimation pressed do
        (
            /*判断一下系统单位是否和引擎保持一致*/
            if (CheckUnits() == true)do
            (
                try
                with redraw off
                (
                    ReInitVarriables()
                    /*把选中的模型压入数组*/
                    for i in selection do if CheckMesh i do append internalArrayOfStaticBaseMeshes i
                   
                    geoConversionModelFailNamelist=#()
                    --遍历所有选中的需要处理的模型，把有问题的模型找出来
                    for i in internalArrayOfStaticBaseMeshes do
                    (
                        CopyMesh = convertTo (snapshot i) Editable_Poly
                        if ((getNumVerts i) != (getNumVerts CopyMesh))then
                        (
                            append geoConversionModelFailNamelist i.name
                        )
                        delete CopyMesh
                    )
                    --如果找到了模型，则不会进行顶点动画的烘焙
                    if geoConversionModelFailNamelist.count > 0 then
                    (
                        string S = "模型有问题"
                        for i in geoConversionModelFailNamelist do append S ("\r" + i)
                        messageBox S
                    )
                    else
                    (
                        if internalArrayOfStaticBaseMeshes.count > 0 then
                        (
                            --把选中的模型在指定范时间围的状态全部snapshot出来，并且把这些数据保存在二维数组masterMorphArray中
                            MakeAndMergeSnapShots internalArrayOfStaticBaseMeshes
                            SmoothCopyMesh masterMorphArray[1]
                            PackVertexUVs originalMesh
                            populateMorphTargetArrays()
                            ClearMeshes()
                            RenderTexture()
                        )
                    )

                )
                catch
                (
                    messageBox "Catched Error !!!"
                    ResumeEditing()
                )
            )
            ResumeEditing()
        )

        on help pressed do
        (
            S = #()
            HelpString = ""
            append S "第一步：输入顶点动画开始的位置。"
            append S "第二步：输入顶点动画结束的位置。"
            append S "第三步：输入顶点动画需要跳过的位置。"
            append S "第四步：选择一个供顶点动画贴图sample的UV空间,默认使用第二套UV"
            append S "第五步：点击生成顶点动画按钮，选择导出路径。"
            for i in S do HelpString += i + "\r\r"
            messageBox HelpString
        )


        /******************************************************************************************************************************************************************************/
    )
    if Morph_Floater != undefined then CloseRolloutFloater Morph_Floater
    global Morph_Floater = newRolloutFloater "" 300 230
    addRollout TexMorphRollout Morph_Floater
)

macros.run "Texture_Vertex_Animaton" "TextureAnimation"
