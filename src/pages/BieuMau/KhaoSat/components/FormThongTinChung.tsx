/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const { loading, record, edit, setCurrent, setRecord } = useModel('bieumau');

  const { danhSach, setCondition: setCondLopHanhChinh } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSach: danhSachUser, setCondition: setCondUser } = useModel('user');
  const { danhSach: danhSachLopTinChi, setCondition } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const [doiTuong, setDoiTuong] = useState<string[]>(record?.loaiDoiTuongSuDung ?? []);
  const [camKet, setCamKet] = useState<boolean>(record?.coCamKet ?? true);

  const debouncedSearchLopTinChi = _.debounce((value) => {
    setCondition({ ten_lop_tin_chi: value });
  }, 500);

  const debouncedSearchLopHanhChinh = _.debounce((value) => {
    setCondLopHanhChinh({ ten_lop_hanh_chinh: value });
  }, 500);

  const debouncedSearchUser = _.debounce((value) => {
    setCondUser({ ma_dinh_danh: value });
  }, 500);

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: BieuMau.Record) => {
          const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
          const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;
          if (values?.loaiDoiTuongSuDung?.includes('Tất cả')) {
            values.loaiDoiTuongSuDung = [];
          }
          if (values?.hinhThucDaoTaoId === -1) {
            values.hinhThucDaoTaoId = undefined;
            values.isTatCaHe = true;
          } else {
            values.isTatCaHe = false;
          }
          delete values.thoiGian;
          setRecord({
            ...record,
            ...values,
            loai: 'Khảo sát',
            thoiGianBatDau,
            thoiGianKetThuc,
            doiTuong: 'Tất cả',
          });
          setCurrent(1);
        }}
        form={form}
      >
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
          initialValue={record?.tieuDe}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.length(255)]}
          initialValue={record?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Tiêu đề" />
        </Form.Item>

        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="thoiGian"
              label="Thời gian bắt đầu - Thời gian kết thúc"
              initialValue={[
                record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
                record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
              ]}
            >
              <DatePicker.RangePicker
                format="HH:mm DD-MM-YYYY"
                disabledDate={(cur) => moment(cur).isBefore(moment())}
                style={{ width: '100%' }}
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                showTime
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              initialValue={edit && record?.isTatCaHe ? -1 : record?.hinhThucDaoTaoId}
              name="hinhThucDaoTaoId"
              label="Hình thức đào tạo"
            >
              <Select placeholder="Hình thức đào tạo">
                <Select.Option value={-1} key={-1}>
                  Tất cả hình thức đào tạo
                </Select.Option>
                {danhSachHinhThucDaoTao?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.ten_hinh_thuc_dao_tao}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              rules={[...rules.required]}
              name="loaiDoiTuongSuDung"
              label="Đối tượng"
              initialValue={
                edit && record?.loaiDoiTuongSuDung?.length === 0 ? ['Tất cả'] : doiTuong
              }
            >
              <Select
                mode="multiple"
                onChange={(val: string[]) => {
                  if (val.includes('Tất cả')) {
                    form.setFieldsValue({
                      loaiDoiTuongSuDung: ['Tất cả'],
                    });
                  }
                  setDoiTuong(val.includes('Tất cả') ? ['Tất cả'] : val);
                }}
                placeholder="Chọn đối tượng"
              >
                {[
                  'Tất cả',
                  'Vai trò',
                  'Lớp tín chỉ',
                  'Lớp hành chính',
                  'Ngành',
                  'Khóa',
                  'Người dùng cụ thể',
                ].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="kichHoat" label="Kích hoạt" initialValue={record?.kichHoat ?? true}>
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="coCamKet" label="Có cam kết" initialValue={record?.coCamKet ?? true}>
              <Radio.Group
                onChange={(val) => {
                  setCamKet(val.target.value);
                }}
              >
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {doiTuong.includes('Lớp hành chính') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachLopHanhChinh"
            label="Lớp hành chính"
            initialValue={record?.danhSachLopHanhChinh ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchLopHanhChinh(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Lớp hành chính"
            >
              {danhSach.map((item) => (
                <Select.Option key={item.ten_lop_hanh_chinh} value={item.ten_lop_hanh_chinh}>
                  {item.ten_lop_hanh_chinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Lớp tín chỉ') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachLopTinChi"
            label="Lớp tín chỉ"
            initialValue={record?.danhSachLopTinChi ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchLopTinChi(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo tên lớp"
            >
              {danhSachLopTinChi.map((item) => (
                <Select.Option key={item.ten_lop_tin_chi} value={item.ten_lop_tin_chi}>
                  {item.ten_lop_tin_chi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Khóa') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachKhoaHoc"
            label="Khóa"
            initialValue={record?.danhSachKhoaHoc ?? []}
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn khóa"
            >
              {danhSachKhoaHoc?.map((item) => (
                <Select.Option key={item.display_name} value={item.display_name}>
                  {item.display_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Ngành') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachNganhHoc"
            label="Ngành học"
            initialValue={record?.danhSachNganhHoc ?? []}
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Ngành học"
            >
              {danhSachNganh.map((item) => (
                <Select.Option key={item.ten_nganh_viet_tat} value={item.ten_nganh_viet_tat}>
                  {item.ten_nganh} ({item.ten_nganh_viet_tat})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Vai trò') && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachVaiTro"
            label="Vai trò"
            initialValue={record?.danhSachVaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Người dùng cụ thể') && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachNguoiDung"
            label="Người dùng cụ thể"
            initialValue={record?.danhSachNguoiDung ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchUser(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo mã định danh"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachUser.map((item) => (
                <Select.Option key={item?.id?.toString() ?? ''} value={item?.id?.toString() ?? ''}>
                  {item?.name} ({item?.ma_dinh_danh})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {camKet && (
          <Form.Item
            rules={[...rules.required]}
            name="noiDungCamKet"
            label="Nội dung cam kết"
            initialValue={record?.noiDungCamKet}
          >
            <Input placeholder="Nội dung cam kết" />
          </Form.Item>
        )}

        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            icon={<ArrowRightOutlined />}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Tiếp theo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
