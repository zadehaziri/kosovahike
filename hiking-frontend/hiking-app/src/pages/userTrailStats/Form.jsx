import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUrlPosition } from '../../hooks/useUrlPosition';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { addPastTrail } from './../../redux/pastTrails/trailsTrackingSlice';
import './Form.scss';
import { convertToEmoji } from '../../helpers/helpers';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Link } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const dispatch = useDispatch();
  const { lat: urlLat, lng: urlLng } = useParams();
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [trailName, setTrailname] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [geocodingError, setGeocodingError] = useState('');
  const [emoji, setEmoji] = useState('Zhgl');
  const [fileList, setFileList] = useState([]);
  const userId = useSelector((state) => state.loggedUser.user._id);
  const isLoadingGeocoding = useSelector(
    (state) => state.trailsTracking.loading
  );
  const [urlLatParam, urlLngParam] = useUrlPosition();
  const navigate = useNavigate();

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  useEffect(() => {
    if (urlLat && urlLng) {
      setLat(parseFloat(urlLat));
      setLng(parseFloat(urlLng));
    } else if (urlLatParam && urlLngParam) {
      setLat(urlLatParam);
      setLng(urlLngParam);
    }
  }, [urlLat, urlLng, urlLatParam, urlLngParam]);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchTrailsLocation() {
      try {
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);

        if (!res.ok) {
          throw new Error('Bad request received');
        }

        const data = await res.json();
        console.log(data);

        if (!data.countryCode) {
          throw new Error(
            "That doesn't seem to be a location. Click somewhere else 😉"
          );
        }

        setTrailname(data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
        setGeocodingError('');
      } catch (err) {
        setGeocodingError(err.message);
      }
    }
    fetchTrailsLocation();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!trailName || !date) return;

    const formData = new FormData();

    formData.append('name', trailName);
    formData.append('country', country);
    formData.append('emoji', emoji);
    formData.append('date', date);
    formData.append('notes', notes);
    formData.append('position.lat', lat);
    formData.append('position.lng', lng);

    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      await dispatch(addPastTrail({ userId, pastTrailData: formData }));
      setTrailname('');
      setCountry('');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setEmoji('');
      setLat(null);
      setLng(null);
      setFileList([]);
      navigate('/user-stats/past-trails');
    } catch (error) {
      console.error('Failed to add past trail:', error);
    }
  }
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadButton = (
    <Button style={{ color: '#000000' }} icon={<UploadOutlined />}>
      Click to Upload
    </Button>
  );

  if (isLoadingGeocoding) return <p>Loading...⌛</p>;

  if (!lat || !lng) return <p>Start by clicking somewhere on the map</p>;

  if (geocodingError) return <p>{geocodingError}</p>;

  return (
    <form className='map-form' onSubmit={handleSubmit}>
      <div className='row'>
        <label htmlFor='trailName'>Trail name</label>
        <input
          id='trailName'
          onChange={(e) => setTrailname(e.target.value)}
          value={trailName}
        />
      </div>

      <div className='row'>
        <label htmlFor='date'>When did you go to {trailName}?</label>

        <input
          type='date'
          id='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className='row'>
        <label htmlFor='notes'>Notes about your trip to {trailName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className='row'>
        <label htmlFor='images'>Upload Images</label>
        <Upload
          multiple
          {...props}
          onChange={handleFileChange}
          fileList={fileList}
        >
          {uploadButton}
        </Upload>
      </div>

      {/* <li onClick={handleOpenBlogModal}>Write a Blog</li> */}
      <Link className='link' to='/blog-form'>
        Write a blog for this trail
      </Link>

      <div className='buttons'>
        <button className='btn' type='primary'>
          Add
        </button>
        <button
          className='back btn'
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </button>
      </div>
    </form>
  );
}

export default Form;
