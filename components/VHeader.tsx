interface VHeaderProps {
  subtitle?: string;
}

export default function VHeader({
  subtitle = "This is a subtitle",
}: VHeaderProps) {
  return (
    <section className="py-20" id="header">
      <div className="container">
        <div className="row items-center">
          <div className="col lg:w-6/12">
            <h1 className="display-4 letter-spacing-xs mb-6 font-semibold">
              The{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary capitalize">
                Catchy Description
              </span>{" "}
              For Usage
            </h1>
            <p className="text-muted text-lg">{subtitle}</p>
            <div className="flex flex-col md:flex-row justify-center lg:justify-left gap-x-3 gap-y-3">
              <a className="btn btn-primary btn-lg" href="#">
                Get Started ➔
              </a>
              <button
                className="btn btn-lg btn-ghost btn-primary"
                //href="#click"
                data-calendly-url="https://calendly.com/volkan-kaya/30min?back=1&month=2021-08"
              >
                Book a Demo
              </button>
            </div>
          </div>
          <div className="col lg:w-6/12 mt-12 lg:mt-0">
            <img
              className="block mx-auto lg:mr-0 pr-6 lg:max-w-[500px]"
              src="https://d1pnnwteuly8z3.cloudfront.net/images/dafc1e05-b0e8-4c6d-b375-4a62333bbd5a/db204aff-2783-412a-9f3d-8ff54d267d9f.png"
              //style="filter:drop-shadow(0.5rem 0.5rem 0.25rem rgba(0, 0, 0, 0.075))"
              width="500"
              height="370"
              alt="product image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
