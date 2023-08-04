"use client"
import React, { useState, useEffect } from 'react';
import { MdOutlineKeyboardArrowDown, MdDone } from "react-icons/md";
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';
import {postAPI, getAPI} from '@/services/fetchAPI';

const DynamicTable = ({ data, selectedCategoryKey, selectedCategoryValues }) => {
  const objectKey = Object.keys(data)[0];
  const responseData = data[objectKey];

  //responseData içerisine yeni bir başlık ekle
  responseData["Extra"] = [
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue2: "",
    },
    {
      id: "ekstra",
      extraValue3: "",
    },
    {
      id: "ekstra",
      extraValue4: "",
    },
    {
      id: "ekstra",
      extraValue5: "",
    },
    {
      id: "ekstra",
      extraValue6: "",
    },
    {
      id: "ekstra",
      extraValue7: "",
    },
    {
      id: "ekstra",
      extraValue8: "",
    },
    {
      id: "ekstra",
      extraValue9: "",
    },
    {
      id: "ekstra",
      extraValue10: "",
    }
  ];

  const [isloading, setIsloading] = useState(false);

  const [createProduct, setCreateProduct] = useState("");
  
  const [selectedFeature, setSelectedFeature] = useState("Ölçüler");
  const [checkboxValues, setCheckboxValues] = useState([]);
  
  const [addTypeEnabled, setAddTypeEnabled] = useState(false);
  const [productTypes, setProductTypes] = useState("");
  const [productType, setProductType] = useState("");

  const [productName , setProductName] = useState("");


  const sendData = async (productName, productType, selectedCategoryKey, selectedCategoryValues, checkboxValues) =>{
    setIsloading(true);
    const data = {
      productName: productName,
      productType: productType,
      selectedCategoryKey: selectedCategoryKey,
      selectedCategoryValues: selectedCategoryValues,
      productFeatures: checkboxValues
    }

    try {
      
      const responseData = await postAPI("/createProduct/createProduct",{data:data, processType:"post"});
      if(!responseData || responseData.status !== "success"){
          console.log(responseData.error)
          throw new Error("Veri eklenemedi");
      }
       setIsloading(false);
       toast.success("Veri başarıyla Eklendi");
  
    } catch (error) {
         toast.error(error.message);
        console.log(error);
    }
  }
  
  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/createProduct');
  
      if(!response){
        throw new Error("Veri çekilemedi 2");
      }
  
      if(response.status !== "success"){
        throw new Error("Veri çekilemedi 3");
      }
      setProductTypes(response.data);
      setIsloading(false);
  
    } catch (error) {
      setIsloading(false);
  
      toast.error(error.message);
      console.log(error);
    }
  } 

  const retunExtraTargetValue = ( data, targetIndex ) => {
    // feature == Extra olanları içinden filtrele
    const filteredData = data.filter(item => item.feature === 'Extra');
  
    // targetIndex'e göre veriyi bul
    const targetData = filteredData.find(item => item.index === targetIndex);
  
    // targetData varsa targetValue'yu döndür, yoksa null döndür
    const targetValue = targetData ? targetData.targetValue : null;
  
    return targetValue;
  };


  useEffect(()  => {
    getData();
  }, [])
  

  // useEffect(() => {
  //   console.log(checkboxValues);
  // }, [checkboxValues])
  

  // Seçilen checkbox değerini state'e ekleyen ana fonksiyon.
  const handleCheckboxChange = (index, feature, featureId, targetValue, checked, value, productName, productType, selectedCategoryKey, selectedCategoryValues) => {
    // Değişen checkbox değerini yeni bir nesne olarak hazırla

    const newValue = {
      index,
      feature,
      featureId,
      targetValue,
      checked,
      value,
      productName,
      productType,
      selectedCategoryKey,
      selectedCategoryValues,
    };

    // Eski arrayi yeni değerle birleştir ve state'i güncelle
    setCheckboxValues((prevValues) => {
      // Eğer önceki değer zaten varsa ve feature değeri aynı ise, onu sil ve yeni değeri ekle
      const filteredValues = prevValues.filter(
        (value) => !(value.index === index && value.feature === feature)
      );

      // checked değeri false ise onu sil
      if (!newValue.checked) return filteredValues;
    
      // Yeni değeri ekleyip güncellenmiş arrayi döndür
      return [...filteredValues, newValue];
    });
  };

  const cancelKeys = objectKey === "furniture" ? [
    'createdAt', 'updatedAt', 'translateEnabled', 'colourPickerEnabled',
    "addSwatchEnabled", "fabricTypeTurkish", "fabricTypeUkrainian", "fabricTypeEnglish", 
    "fabricDescriptionTurkish", "fabricDescriptionUkrainian", "fabricDescriptionEnglish",
     "fabricSwatchUkrainian", "fabricSwatchEnglish", "fabricSwatchTurkish",
    'addTypeEnabled', 'oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined',
    'metalTypeTurkish', 'metalTypeUkrainian', 'metalTypeEnglish',
    'metalDescriptionTurkish', 'metalDescriptionUkrainian', 'metalDescriptionEnglish',
    'turkish', 'ukrainian', 'english', 'colourTypeTurkish', 'colourTypeUkrainian', 'colourTypeEnglish',
    'colourDescriptionTurkish', 'colourDescriptionUkrainian', 'colourDescriptionEnglish'
  ] : [];

  const handleFeatureSelect = (feature) => setSelectedFeature(feature);

  const getFeatureItems = () => Object.keys(responseData);

  const renderCell = (key, value) => (
    key === 'image' && value && value.length > 0 ?
      <div className='flex justify-center item-center'>
        <Image width={150} height={150} src={value} alt="Image" className="h-35 w-35 object-cover hover:scale-150 transition-all hover:border-2 border-gray-600 hover:rounded" />
      </div>
      : value
  );

  const renderTable = () => {
    if (selectedFeature === null) return null;
    const selectedResponseData = responseData[selectedFeature];

    const filteredData = selectedResponseData.map(item => {
      const filteredItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!cancelKeys.includes(key)) filteredItem[key] = value;
      });
      return filteredItem;
    });

    const headerMappings = {
      // Ölçü
      firstValue: "1. Ölçü",
      secondValue: "2. Ölçü",
      unit: "Birim",

      // Renkler
      colourType: "Renk Tipi",
      colourDescription: "Renk Açıklaması",
      colourHex: "Renk Kodu",

      // Kumaş
      fabricType: "Kumaş Tipi",
      fabricDescription: "Kumaş Açıklaması",
      fabricSwatch: "Kartela",
      image: "Resim",

      // Metal
      metalType: "Metal Tipi",
      metalDescription: "Metal Açıklaması",
      image: "Resim",

      // Extra
      extraValue1: "Ekstra",
      extraValue2: "Açıklama",

    };

    // tablo fonksiyonu
    return (
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-3 text-white bg-blue-600 font-bold border-l border-white">Sıra</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">Standart</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">+ ücret</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">- ücret</th>
              {Object.keys(filteredData[0]).map(header => (
                // tablo başlıklarının listelendiği bölüm
                header != "id" &&
                <th key={header} className="p-3 text-white bg-blue-600 border-l border-white font-bold">
                  {headerMappings[header] || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              // tablo satırlarının listelendiği bölüm
              <tr key={index} 
              // eğer checkboxlardan herhangi biri seçilmişs ise bu satırı bg-green-200 yap.
              className={checkboxValues && checkboxValues.some(
                (value) =>
                  value.index === index &&
                  value.feature === selectedFeature &&
                  value.checked === true
              ) ? "bg-blue-50 " : ""}

              >
                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                {/* eğer checkboxlardan herhangi biri seçilmiş ise bu veriyi tik şareti yap. */}
                  <div className='h-full flex  justify-center items-center gap-2'>
                    {checkboxValues && checkboxValues.some((value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.checked === true) && 
                        <MdDone size={25} color='green' className="" />
                    }

                    {index + 1}
                  </div>
                </td>

                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="standard" value="standard" className='scale-150 cursor-pointer'

                    checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "standard"
                    )}


                    onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "standard", e.target.checked, null , productName, productType, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />
                  
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                  <input type="checkbox" name="plus" value="plus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "plus", e.target.checked, null, productName, productType, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />

                  { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    placeholder='322'
                    min={1}
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "plus",true, e.target.value.toString(), productName, productType, selectedCategoryKey, selectedCategoryValues)

                    }}
                  />
                  : null
                  }
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="minus" value="minus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                    (value) =>
                      value.index === index &&
                      value.feature === selectedFeature &&
                      value.targetValue === "minus"
                  )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "minus", e.target.checked, null, productName, productType, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />

                    { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "minus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    min={1}
                    placeholder='145'
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "minus",true, ((-1 * e.target.value).toString()), productName, productType, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />
                  : null
                  }
                </td>

                {Object.entries(item).map(([key, value]) => (
                  key != "id" && key.includes("extraValue")  ? 
                                 
                  
                  <td key={key}  className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">

                    <input type="text"

                    disabled={checkboxValues && checkboxValues.some((value) =>
                      value.feature.toLowerCase().includes("extra") && value.index === index && value.checked === true 
                    ) ? false : true}

                    placeholder='Ekstra değer'
                    className="p-2 border border-gray-300 rounded-md ml-4 text-center w-full lg:w-2/3 "
                    onChange={(e) => {
                      e.target.value.length > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id+index, retunExtraTargetValue(checkboxValues, index).toString() ,true, e.target.value, productName, productType, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />
                  </td> :                   
                  key != "id" &&
                  <td key={key} className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                    {key === "colourHex" ? (
                      <div style={{backgroundColor: value}}
                      className='p-4 rounded flex justify-center items-center text-white'
                      >{renderCell(key, value)}</div>
                      )

                      : renderCell(key, value)
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {isloading && <LoadingScreen isloading={isloading} />}

      <div className='w-full bg-gray-100 p-2 lg:my-10 my-4 flex flex-row flex-wrap gap-4 justify-center item-center'>
        <div className="flex flex-col justify-center items-center ">
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Ürün Adı </h3>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={productName}
            className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 "
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />

        </div>
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Ürün Tipi </h3>
          <div className='flex flex-row gap-4'>
            <div className="flex flex-col justify-center items-center ">
                
                {/* (Ürün Tipi Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                <select 
                  onChange={(e) => {!addTypeEnabled && setProductType(e.target.value)}}
                  type="select"
                  disabled={addTypeEnabled ? true : false}
                  value={!addTypeEnabled ? productType : ""}
                  id={`productType`}
                  name={`productType`}              
                  className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  
                  <option value="">Ürün Tipi Seç</option>
                  {
                    productTypes && productTypes.map((item, index) => (
                    // productType içi boş olanları eklemiyoruz.
                    item.productType != "" && item.productType &&

                    // aynı değere sahip olanlardan sadece birini ekliyoruz.
                    !productTypes.slice(0, index).some((item2) => item2.productType === item.productType) &&

                    <option key={index} value={item.productType}>{item.productType}</option>
                                            
                    ))
                  }
                </select>
              </div>             
              <div className='flex flex-col justify-center items-center'>
                <div className={`flex justify-center items-center gap-2 flex-col lg:flex-row`}>
                  <button
                    type='button'
                    onClick={ () => {setAddTypeEnabled(!addTypeEnabled)}}
                  >
                    {
                    addTypeEnabled ?
                    <div 
                    onClick={() => {setProductType("")}}
                    className='hover:scale-105 transition-all p-2 bg-red-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoCloseOutline size={20}/> <h4 className='whitespace-nowrap'>İptal</h4>
                    </div>
                    :
                    <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Ürün Tipi Ekle</h4>
                    </div>
                    }                    
                  </button>
                                    
                  <div className={`${addTypeEnabled ? "block" : "hidden"}`}>
                    <input
                      onChange={(e) => {addTypeEnabled && setProductType(e.target.value)}}
                      id={`productType`}
                      name={`productType`}
                      value={productType}
                      className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 `}
                      type="text"
                      placeholder="Yeni Ürün Tipi Adı Giriniz."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>


      { productType && productType != "" && productType.trim().length > 0 && productName &&  productName != "" && productName.trim().length > 0 ?   
          <div className='w-full'>
            <ul className="flex space-x-2 w-full p-4 justify-center item-center h-full flex-wrap gap-2">
              {getFeatureItems().map(featureItem => (
                <li
                  key={featureItem}
                  onClick={() => handleFeatureSelect(featureItem)}
                  className={`cursor-pointer py-2 px-4 ml-2 rounded-md flex flex-row flex-nowrap gap-2 justify-center items-center
                  ${selectedFeature === featureItem ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                  ${ featureItem == "Ölçüler" && "order-first ml-0"}`}
                >
                  {featureItem}
                </li>
              ))}

            </ul>
            {renderTable()}
            <div className='w-full flex justify-around items-center p-4'>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setCheckboxValues([])}>
                Tümünü Temizle
              </button>
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={()=>sendData(productName, productType, selectedCategoryKey, selectedCategoryValues, checkboxValues)}>
                Ürünü Kaydet
              </button>
            </div>
          </div>
          :
          <div className='w-full flex justify-center items-center p-2 m-2'>
            <h3 className='text-center font-bold text-red-600'>Verileri Görmeden Önce Lütfen Ürün Adını ve Ürün Tipini Giriniz.</h3>
          </div>
      }
    </div>
  );
};

export default DynamicTable;


