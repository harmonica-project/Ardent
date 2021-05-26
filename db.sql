PGDMP     8    :                 y           slr     13.2 (Ubuntu 13.2-1.pgdg20.04+1)     13.2 (Ubuntu 13.2-1.pgdg20.04+1) )               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16384    slr    DATABASE     X   CREATE DATABASE slr WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE slr;
                postgres    false            �            1259    16385    architectures    TABLE     �   CREATE TABLE public.architectures (
    id uuid NOT NULL,
    reader_description character varying,
    paper_id uuid NOT NULL,
    name character varying NOT NULL,
    author_description character varying
);
 !   DROP TABLE public.architectures;
       public         heap    postgres    false                       0    0 '   COLUMN architectures.author_description    COMMENT     �   COMMENT ON COLUMN public.architectures.author_description IS 'This field is different from reader_description : content must be extracted from the paper (copy/paste description), rather than explained from our knowledge';
          public          postgres    false    200            �            1259    24591    categories_base    TABLE     d   CREATE TABLE public.categories_base (
    id uuid NOT NULL,
    label character varying NOT NULL
);
 #   DROP TABLE public.categories_base;
       public         heap    postgres    false            �            1259    16391    components_base    TABLE     �   CREATE TABLE public.components_base (
    id uuid NOT NULL,
    name character varying NOT NULL,
    base_description character varying,
    category_id uuid
);
 #   DROP TABLE public.components_base;
       public         heap    postgres    false            �            1259    16397    components_instances    TABLE     �   CREATE TABLE public.components_instances (
    id uuid NOT NULL,
    name character varying NOT NULL,
    architecture_id uuid NOT NULL,
    reader_description character varying,
    author_description character varying,
    component_base_id uuid
);
 (   DROP TABLE public.components_instances;
       public         heap    postgres    false            �            1259    16403    connections    TABLE     �   CREATE TABLE public.connections (
    id uuid NOT NULL,
    first_component uuid NOT NULL,
    second_component uuid NOT NULL,
    datatype character varying,
    direction character varying,
    name character varying
);
    DROP TABLE public.connections;
       public         heap    postgres    false            �            1259    16406    invite_tokens    TABLE     L   CREATE TABLE public.invite_tokens (
    token character varying NOT NULL
);
 !   DROP TABLE public.invite_tokens;
       public         heap    postgres    false            �            1259    16412    papers    TABLE     �  CREATE TABLE public.papers (
    id uuid NOT NULL,
    name character varying NOT NULL,
    doi character varying,
    authors character varying NOT NULL,
    paper_type character varying,
    journal character varying,
    added_by character varying NOT NULL,
    updated_by character varying NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    abstract character varying,
    comments character varying
);
    DROP TABLE public.papers;
       public         heap    postgres    false            �            1259    16419    properties_base    TABLE     �   CREATE TABLE public.properties_base (
    id uuid NOT NULL,
    key character varying NOT NULL,
    component_base_id uuid NOT NULL,
    category character varying
);
 #   DROP TABLE public.properties_base;
       public         heap    postgres    false            �            1259    16425    properties_instances    TABLE     �   CREATE TABLE public.properties_instances (
    id uuid NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL,
    component_instance_id uuid,
    category character varying
);
 (   DROP TABLE public.properties_instances;
       public         heap    postgres    false            �            1259    24576 	   questions    TABLE     �   CREATE TABLE public.questions (
    id uuid NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL,
    username character varying NOT NULL,
    date timestamp with time zone
);
    DROP TABLE public.questions;
       public         heap    postgres    false            �            1259    16432    users    TABLE       CREATE TABLE public.users (
    username character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    role character varying NOT NULL,
    is_admin boolean NOT NULL,
    hash character varying NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            ]           2606    16439     architectures architectures_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.architectures
    ADD CONSTRAINT architectures_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.architectures DROP CONSTRAINT architectures_pkey;
       public            postgres    false    200            x           2606    24598 $   categories_base categories_base_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.categories_base
    ADD CONSTRAINT categories_base_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.categories_base DROP CONSTRAINT categories_base_pkey;
       public            postgres    false    210            `           2606    16441 $   components_base components_base_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.components_base
    ADD CONSTRAINT components_base_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.components_base DROP CONSTRAINT components_base_pkey;
       public            postgres    false    201            c           2606    16443 $   components_instances components_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.components_instances
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.components_instances DROP CONSTRAINT components_pkey;
       public            postgres    false    202            k           2606    16445     invite_tokens invite_tokens_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.invite_tokens
    ADD CONSTRAINT invite_tokens_pkey PRIMARY KEY (token);
 J   ALTER TABLE ONLY public.invite_tokens DROP CONSTRAINT invite_tokens_pkey;
       public            postgres    false    204            m           2606    16447    papers papers_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.papers
    ADD CONSTRAINT papers_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.papers DROP CONSTRAINT papers_pkey;
       public            postgres    false    205            o           2606    16449 $   properties_base properties_base_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.properties_base
    ADD CONSTRAINT properties_base_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.properties_base DROP CONSTRAINT properties_base_pkey;
       public            postgres    false    206            r           2606    16451 $   properties_instances properties_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.properties_instances
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.properties_instances DROP CONSTRAINT properties_pkey;
       public            postgres    false    207            v           2606    24583    questions questions_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    209            i           2606    16453    connections relations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.connections
    ADD CONSTRAINT relations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.connections DROP CONSTRAINT relations_pkey;
       public            postgres    false    203            t           2606    16455    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    208            d           1259    16456    fki_archConstraint    INDEX     `   CREATE INDEX "fki_archConstraint" ON public.components_instances USING btree (architecture_id);
 (   DROP INDEX public."fki_archConstraint";
       public            postgres    false    202            a           1259    24604     fki_base_component_to_categories    INDEX     c   CREATE INDEX fki_base_component_to_categories ON public.components_base USING btree (category_id);
 4   DROP INDEX public.fki_base_component_to_categories;
       public            postgres    false    201            p           1259    16457    fki_compConstraint    INDEX     f   CREATE INDEX "fki_compConstraint" ON public.properties_instances USING btree (component_instance_id);
 (   DROP INDEX public."fki_compConstraint";
       public            postgres    false    207            e           1259    16458    fki_componentBaseConstraint    INDEX     k   CREATE INDEX "fki_componentBaseConstraint" ON public.components_instances USING btree (component_base_id);
 1   DROP INDEX public."fki_componentBaseConstraint";
       public            postgres    false    202            f           1259    16459    fki_first_component_constraint    INDEX     a   CREATE INDEX fki_first_component_constraint ON public.connections USING btree (first_component);
 2   DROP INDEX public.fki_first_component_constraint;
       public            postgres    false    203            ^           1259    16460    fki_paperConstraint    INDEX     S   CREATE INDEX "fki_paperConstraint" ON public.architectures USING btree (paper_id);
 )   DROP INDEX public."fki_paperConstraint";
       public            postgres    false    200            g           1259    16461    fki_second_component_constraint    INDEX     c   CREATE INDEX fki_second_component_constraint ON public.connections USING btree (second_component);
 3   DROP INDEX public.fki_second_component_constraint;
       public            postgres    false    203            {           2606    16462 +   components_instances architectureConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.components_instances
    ADD CONSTRAINT "architectureConstraint" FOREIGN KEY (architecture_id) REFERENCES public.architectures(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 W   ALTER TABLE ONLY public.components_instances DROP CONSTRAINT "architectureConstraint";
       public          postgres    false    2909    200    202            z           2606    24599 ,   components_base base_component_to_categories    FK CONSTRAINT     �   ALTER TABLE ONLY public.components_base
    ADD CONSTRAINT base_component_to_categories FOREIGN KEY (category_id) REFERENCES public.categories_base(id) ON UPDATE CASCADE NOT VALID;
 V   ALTER TABLE ONLY public.components_base DROP CONSTRAINT base_component_to_categories;
       public          postgres    false    210    201    2936                       2606    16467 #   properties_instances compConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.properties_instances
    ADD CONSTRAINT "compConstraint" FOREIGN KEY (component_instance_id) REFERENCES public.components_instances(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.properties_instances DROP CONSTRAINT "compConstraint";
       public          postgres    false    202    2915    207            |           2606    16472 ,   components_instances componentBaseConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.components_instances
    ADD CONSTRAINT "componentBaseConstraint" FOREIGN KEY (component_base_id) REFERENCES public.components_base(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 X   ALTER TABLE ONLY public.components_instances DROP CONSTRAINT "componentBaseConstraint";
       public          postgres    false    2912    201    202            }           2606    16477 $   connections firstComponentConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.connections
    ADD CONSTRAINT "firstComponentConstraint" FOREIGN KEY (first_component) REFERENCES public.components_instances(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 P   ALTER TABLE ONLY public.connections DROP CONSTRAINT "firstComponentConstraint";
       public          postgres    false    2915    203    202            y           2606    16482    architectures paperConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.architectures
    ADD CONSTRAINT "paperConstraint" FOREIGN KEY (paper_id) REFERENCES public.papers(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 I   ALTER TABLE ONLY public.architectures DROP CONSTRAINT "paperConstraint";
       public          postgres    false    205    200    2925            ~           2606    16487 %   connections secondComponentConstraint    FK CONSTRAINT     �   ALTER TABLE ONLY public.connections
    ADD CONSTRAINT "secondComponentConstraint" FOREIGN KEY (second_component) REFERENCES public.components_instances(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public.connections DROP CONSTRAINT "secondComponentConstraint";
       public          postgres    false    202    203    2915           